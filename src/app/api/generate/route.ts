import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      senderName,
      senderAddress,
      receiverName,
      receiverAddress,
      amount,
      description,
      senderType,
      lawyerName,
      lawyerAddress,
      evidenceText,
      targetDoc = 'legalNotice',
      refinement,
      currentDraft
    } = body;

    const isLawyer = !!lawyerName && senderType === 'lawyer';

    // Format structured address (Street\nCity\nState\nPIN → readable string)
    const formatAddr = (raw: string = '') => {
      const parts = raw.split('\n').map(p => p.trim()).filter(Boolean);
      if (parts.length >= 4) return `${parts[0]}, ${parts[1]}, ${parts[2]} - ${parts[3]}`;
      return parts.join(', ');
    };

    const senderAddrFormatted = formatAddr(senderAddress);
    const receiverAddrFormatted = formatAddr(receiverAddress);
    const lawyerAddrFormatted = lawyerAddress || '';

    // --- Secure Storage Logic ---
    try {
      const dataDir = path.join(process.cwd(), '.secure_data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
      const dbFile = path.join(dataDir, 'confidential_records.json');
      const secureRecord = { id: crypto.randomUUID(), timestamp: new Date().toISOString(), status: `request_${targetDoc}` };
      let records = [];
      if (fs.existsSync(dbFile)) records = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
      records.push(secureRecord);
      fs.writeFileSync(dbFile, JSON.stringify(records, null, 2));
    } catch (e) { }

    const prompt = `You are an elite Indian Legal Drafting Expert specializing in the Bharatiya Nyaya Sanhita (BNS) 2023.
      Draft a highly professional, authoritative, and legally sound ${targetDoc} based on the role specified below.
      
      CONTEXT:
      - Sender: ${senderName} (Address: ${senderAddrFormatted})
      - Opposing Party: ${receiverName} (Address: ${receiverAddrFormatted})
      - Disputed Amount: Rs. ${amount}
      - Default Description: ${description}
      ${isLawyer ? `- Advocate: ${lawyerName} (Office: ${lawyerAddrFormatted})` : ''}
      ${evidenceText ? `\nREFERENCE EVIDENCE: "${evidenceText}"` : ''}
      
      YOUR SPECIFIC TASK:
      ${refinement ? `REFINE the existing ${targetDoc} provided below based on: "${refinement}"\nEXISTING: ${currentDraft}` :
        `IDENTITIY & HEADING RULES: 
         ${isLawyer
          ? `You are Advocate ${lawyerName} with office at ${lawyerAddrFormatted}. The notice MUST be in the third person on behalf of ${senderName}. 
             PREAMBLE: "Under instructions from my client ${senderName}, resident of ${senderAddrFormatted}, I, Advocate ${lawyerName}, hereby serve you with this formal Legal Notice..."`
          : `You are ${senderName} (Resident of ${senderAddrFormatted}) drafting this FOR YOURSELF. You MUST use the FIRST PERSON ("I, ${senderName}, hereby...").`}
         
         DOCUMENT HEADER:
         - Place the Sender's (Advocate or Self) name and address at the top.
         - Place the Recipient's (${receiverName}) name and address below it.
         - Include a formal Date and SUBJECT line.`}
      
      GUIDELINES:
      - Citations: Bharatiya Nyaya Sanhita (BNS) 2023.
      - Format: Numbered paragraphs. No markdown bolding (**).
      - Style: Authoritative and legally precise.
      
      OUTPUT FORMAT: Return ONLY a JSON object with a single key: "${targetDoc}". No markdown boxes.`;

    const geminiKey = process.env.GEMINI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!geminiKey && !openRouterKey) throw new Error('No API Key configured. Please set GEMINI_API_KEY or OPENROUTER_API_KEY.');

    let responseText = '';

    // ── TIER 1: Gemini models ──
    if (geminiKey) {
      const geminiModels = [
        'gemini-2.5-flash',        // Latest & best — billing enabled
        'gemini-2.0-flash-lite',   // Lighter, fast fallback
        'gemini-flash-latest',     // Alias fallback
        'gemini-flash-lite-latest',
      ];
      for (const model of geminiModels) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
        const attempt = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 3000, temperature: 0.7 }
          })
        });
        if (attempt.status === 429 || attempt.status === 404) {
          console.warn(`[BFF] Gemini ${model}: ${attempt.status}, trying next...`);
          continue;
        }
        if (attempt.ok) {
          const data = await attempt.json();
          responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (responseText) { console.log(`[BFF] Served by Gemini: ${model}`); break; }
        }
      }
    }

    // ── TIER 2: OpenRouter fallback — each model has its own independent quota pool ──
    if (!responseText && openRouterKey) {
      console.log('[BFF] Gemini quota exhausted, falling back to OpenRouter...');
      const orModels = [
        'deepseek/deepseek-r1:free',           // DeepSeek R1 - strong reasoning
        'deepseek/deepseek-chat-v3-0324:free', // DeepSeek V3
        'meta-llama/llama-3.3-70b-instruct:free',
        'qwen/qwen2.5-72b-instruct:free',      // Qwen 2.5 - excellent at structured output
        'google/gemma-3-27b-it:free',
        'google/gemma-2-9b-it:free',           // Separate quota from gemma-3
        'mistralai/mistral-7b-instruct:free',
        'meta-llama/llama-3.1-8b-instruct:free',
      ];
      for (const model of orModels) {
        const attempt = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://ai-legal-notice-generator.vercel.app',
            'X-Title': 'AI Legal Notice Generator'
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 3000,
            temperature: 0.7
          })
        });
        if (attempt.status === 429 || attempt.status === 402) {
          console.warn(`[BFF] OpenRouter ${model}: ${attempt.status}, trying next...`);
          continue;
        }
        if (attempt.ok) {
          const data = await attempt.json();
          responseText = data.choices?.[0]?.message?.content || '';
          if (responseText) { console.log(`[BFF] Served by OpenRouter: ${model}`); break; }
        }
      }
    }

    if (!responseText) {
      throw new Error('Service temporarily unavailable: all AI providers are quota-limited. Please try again in a few minutes.');
    }


    console.log(`[BFF] AI successfully drafted ${targetDoc}. Length: ${responseText.length}`);

    let finalDraft = '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0].trim());
        const draft = parsed[targetDoc] || parsed.text || parsed.content || parsed;

        // If the draft itself is a JSON-like string (recursive issue), try one more parse
        if (typeof draft === 'string' && draft.trim().startsWith('{')) {
          try {
            const inner = JSON.parse(draft);
            finalDraft = inner[targetDoc] || inner.text || inner;
          } catch {
            finalDraft = draft;
          }
        } else {
          finalDraft = typeof draft === 'object' ? JSON.stringify(draft) : draft;
        }
      } catch (e) {
        console.warn('[BFF] JSON parse failed, extracting raw.');
      }
    }

    if (!finalDraft) {
      finalDraft = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    }

    return NextResponse.json({ [targetDoc]: finalDraft });

  } catch (err: any) {
    console.error('[BFF] Fatal Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
