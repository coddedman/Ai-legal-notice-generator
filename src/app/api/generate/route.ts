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

    // ── SHARED CONTEXT ──
    const contextBlock = `
PARTIES:
- Sender/Complainant: ${senderName}, ${senderAddrFormatted}
- Opposite Party: ${receiverName}, ${receiverAddrFormatted}
- Disputed Amount: Rs. ${amount}
- Dispute: ${description}
${isLawyer ? `- Drafting Advocate: ${lawyerName}, ${lawyerAddrFormatted}` : ''}
${evidenceText ? `\nEVIDENCE:\n${evidenceText}` : ''}`;

    // ── SPECIALISED PROMPTS BY DOC TYPE ──
    let prompt = '';

    if (targetDoc === 'legalNotice') {
      prompt = `You are a senior Indian advocate drafting a formal Legal Notice under the Bharatiya Nyaya Sanhita (BNS) 2023.
${contextBlock}

${refinement
  ? `REFINE this existing draft based on: "${refinement}"\nEXISTING DRAFT:\n${currentDraft}`
  : `DRAFT A COMPLETE LEGAL NOTICE following this EXACT structure:

[LINE 1] ${isLawyer ? `Adv. ${lawyerName}` : senderName}
[LINE 2] ${isLawyer ? lawyerAddrFormatted : senderAddrFormatted}
[BLANK LINE]
[DATE]  Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
[BLANK LINE]
To,
${receiverName}
${receiverAddrFormatted}
[BLANK LINE]
SUBJECT: LEGAL NOTICE FOR [RELEVANT BNS OFFENCES BASED ON FACTS]
[BLANK LINE]
Dear Sir/Madam,
[BLANK LINE]
${isLawyer
  ? `Under instructions from and on behalf of my client, ${senderName}, resident of ${senderAddrFormatted}, I, ${lawyerName}, Advocate, hereby issue this Legal Notice to you as under:`
  : `I, ${senderName}, resident of ${senderAddrFormatted}, hereby issue this Legal Notice to you as under:`}
[BLANK LINE]
[NUMBERED PARAGRAPHS — minimum 6 paragraphs covering: (1) relationship/contract, (2) payment/obligation, (3) breach/default, (4) losses suffered, (5) legal provisions under BNS 2023 with section numbers, (6) demand with 15-day ultimatum]
[BLANK LINE]
Yours faithfully,
[BLANK LINE]
${isLawyer ? `Adv. ${lawyerName}\n(Counsel for ${senderName})` : senderName}`}

RULES:
- Use real BNS 2023 section numbers (e.g., Section 318 for cheating, Section 316 for criminal breach of trust)
- No markdown bold (**). Use plain text only.
- Write full paragraphs — minimum 6.
- Be legally precise and authoritative.

OUTPUT: Return ONLY the plain text of the notice. No JSON. No markdown. Just the document.`;

    } else if (targetDoc === 'whatsappMessage') {
      prompt = `You are drafting a WhatsApp demand message for an Indian consumer.
${contextBlock}

${refinement
  ? `REFINE this existing draft based on: "${refinement}"\nEXISTING:\n${currentDraft}`
  : `Write a firm, professional WhatsApp message from ${senderName} to ${receiverName}.

STRUCTURE:
- Opening: State who you are and the issue directly
- Middle: Key facts (dates, amount paid, what was promised, what happened)
- Demand: Clear ask — refund Rs. ${amount} within [7 days] or you will file a police complaint + consumer forum case
- Closing: Your contact or final warning

TONE: Firm, professional, and official. No slang. No emojis. Plain text only.
LENGTH: Under 300 words. Short paragraphs suitable for WhatsApp.`}

OUTPUT: Return ONLY the plain text of the WhatsApp message. No JSON. No markdown. Just the message text.`;

    } else if (targetDoc === 'complaintDraft') {
      prompt = `You are an Indian legal expert drafting a formal Consumer Forum Complaint under the Consumer Protection Act 2019.
${contextBlock}

${refinement
  ? `REFINE this existing draft based on: "${refinement}"\nEXISTING:\n${currentDraft}`
  : `Draft a complete Consumer Forum complaint with this EXACT structure:

BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION
[RELEVANT DISTRICT]

COMPLAINT NO. ___/[YEAR]

IN THE MATTER OF:
${senderName}
${senderAddrFormatted}
                                        ...COMPLAINANT

VERSUS

${receiverName}
${receiverAddrFormatted}
                                        ...OPPOSITE PARTY

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

MOST RESPECTFULLY SUBMITTED AS UNDER:

BRIEF FACTS:
[Numbered paragraphs — 1 to 8+ covering: complainant details, opposite party details, service contracted, amount paid, what was promised, what failed, mental agony, previous attempts to resolve]

CAUSE OF ACTION:
[When and how the cause of action arose]

PRAYER:
The complainant therefore most respectfully prays that this Hon'ble Commission may be pleased to:
(a) Direct the Opposite Party to refund Rs. ${amount}/- with interest;
(b) Award Rs. [XX,000]/- as compensation for mental agony;
(c) Award Rs. [XX,000]/- as litigation costs;
(d) Pass any other order as deemed fit.

PLACE: [City]
DATE:
                                        (${senderName})
                                        COMPLAINANT`}

OUTPUT: Return ONLY the plain text of the complaint. No JSON. No markdown. Just the document.`;
    }

    const outputKey = targetDoc;


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

    // Prompts now ask for PLAIN TEXT — handle that first, fall back to JSON parsing
    const extractText = (raw: string): string => {
      const cleaned = raw.replace(/^```(?:json|text)?\n?/, '').replace(/\n?```$/, '').trim();

      // If it looks like plain text (doesn't start with {), return directly
      if (!cleaned.startsWith('{')) return cleaned;

      // Model returned JSON despite instruction — parse it out
      try {
        const parsed = JSON.parse(cleaned);
        let draft = parsed[targetDoc] ?? parsed.text ?? parsed.content ?? Object.values(parsed)[0];
        if (Array.isArray(draft)) return draft.join('\n');
        if (typeof draft === 'string' && draft.trim().startsWith('{')) {
          try {
            const inner = JSON.parse(draft);
            const v = inner[targetDoc] ?? inner.text ?? Object.values(inner)[0];
            if (Array.isArray(v)) return (v as string[]).join('\n');
            if (typeof v === 'string') return v;
          } catch { return draft; }
        }
        if (typeof draft === 'string') return draft;
      } catch { /* not valid JSON, return as-is */ }

      return cleaned;
    };

    const finalDraft = extractText(responseText);
    if (!finalDraft) throw new Error('AI returned an empty document. Please try again.');

    return NextResponse.json({ [targetDoc]: finalDraft });

  } catch (err: any) {
    console.error('[BFF] Fatal Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
