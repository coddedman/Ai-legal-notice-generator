import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      issueType,
      senderName,
      receiverName,
      amount,

      description,
      senderType,
      lawyerName,
      evidenceText,
      targetDoc = 'legalNotice',
      refinement,
      currentDraft
    } = body;

    const isLawyer = !!lawyerName && senderType === 'lawyer';

    // --- Secure Storage Logic (kept for architecture integrity) ---
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
      - Sender: ${senderName}
      - Opposing Party: ${receiverName}
      - Disputed Amount: Rs. ${amount}
      - Default Description: ${description}
      ${evidenceText ? `\nREFERENCE EVIDENCE: "${evidenceText}"` : ''}
      
      YOUR SPECIFIC TASK:
      ${refinement ? `REFINE the existing ${targetDoc} provided below based on: "${refinement}"\nEXISTING: ${currentDraft}` :
        `IDENTITIY FOR DRAFTING: 
         ${isLawyer
          ? `You are Advocate ${lawyerName}. The notice MUST be in the third person on behalf of ${senderName}. Use preamble: "Under instructions from my client ${senderName}, I, Advocate ${lawyerName}, hereby..."`
          : `You are ${senderName} drafting this FOR YOURSELF. You MUST use the FIRST PERSON ("I, ${senderName}, hereby..."). Do NOT mention any external lawyer name.`}
         
         Document Structure:
         - Formal Header with Date and Recipient.
         - SUBJECT: Legal Notice regarding ${issueType}.
         - 1. FACTS OF THE CASE.
         - 2. LEGAL VIOLATIONS (BNS 2023).
         - 3. ULTIMATUM & SIGNATURE.`}
      
      GUIDELINES:
      - Citations: Bharatiya Nyaya Sanhita (BNS) 2023.
      - Format: Numbered paragraphs. No markdown bolding (**).
      - Style: Authoritative and legally precise.
      
      OUTPUT FORMAT: Return ONLY a JSON object with a single key: "${targetDoc}". No markdown boxes.`;

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error('API Key missing. Please set GEMINI_API_KEY.');

    // Using FETCH for maximum control and speed (bypassing SDK 404s)
    // Primary model: gemini-flash-latest (Confirmed available for this project key)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 3000,
          temperature: 0.7,
        }
      })
    });

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
