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

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error('API Key missing. Please set GEMINI_API_KEY.');

    // Model waterfall — tries each in order, skips on 429 quota errors
    const models = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-flash-latest',
    ];

    let response: Response | null = null;
    let triedModels: string[] = [];

    for (const model of models) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const attempt = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 3000, temperature: 0.7 }
        })
      });

      triedModels.push(model);

      if (attempt.status === 429) {
        console.warn(`[BFF] Model ${model} quota exceeded, trying next...`);
        continue; // try next model
      }

      if (attempt.status === 404) {
        console.warn(`[BFF] Model ${model} not found, trying next...`);
        continue;
      }

      response = attempt;
      console.log(`[BFF] Using model: ${model}`);
      break;
    }

    if (!response) {
      throw new Error(`All Gemini models quota exceeded for today. Please try again tomorrow or upgrade your Gemini API plan at ai.google.dev. Tried: ${triedModels.join(', ')}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[BFF] Gemini API Error:', errorText);
      throw new Error(`Gemini API Error: ${errorText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) throw new Error('Empty response from Gemini.');

    console.log(`[BFF] Gemini successfully drafted ${targetDoc}. Length: ${content.length}`);

    let finalDraft = '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

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
      finalDraft = content.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    }

    return NextResponse.json({ [targetDoc]: finalDraft });

  } catch (err: any) {
    console.error('[BFF] Fatal Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
