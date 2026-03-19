import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const logFile = path.join(process.cwd(), '.secure_data', 'api_debug.log');
  const log = (msg: string, data?: any) => {
    const entry = `[${new Date().toISOString()}] ${msg} ${data ? JSON.stringify(data) : ''}\n`;
    try { fs.appendFileSync(logFile, entry); } catch(e) {}
    console.log(`[BFF] ${msg}`, data || '');
  };

  try {
    const body = await req.json();
    const {
      senderName, senderAddress, receiverName, receiverAddress,
      amount, description, senderType, lawyerName, lawyerAddress,
      evidenceText, language = 'en', targetDoc = 'legalNotice',
      refinement, currentDraft, lawyerLogo, lawyerStamp
    } = body;

    log('Start Request', { targetDoc, language, isLawyer: senderType === 'lawyer' });

    const LANGUAGE_NAMES: Record<string, string> = {
      en: 'English', hi: 'Hindi (हिंदी)', mr: 'Marathi (मराठी)',
      bn: 'Bengali (বাংলা)', ta: 'Tamil (தமிழ்)', te: 'Telugu (తెలుగు)',
      gu: 'Gujarati (ગુજરાતી)', kn: 'Kannada (ಕನ್ನಡ)',
      pa: 'Punjabi (ਪੰਜਾਬੀ)', ml: 'Malayalam (മലയാളം)',
    };
    const langName = LANGUAGE_NAMES[language] || 'English';
    const langPrefix = language === 'en' ? '' :
      `ABSOLUTE REQUIREMENT: Write this ENTIRE document in ${langName}. Every word of the body text must be in ${langName} script. Only law section numbers/citations may remain in English.\n\n`;

    const isLawyer = !!lawyerName && senderType === 'lawyer';

    const formatAddr = (raw: string = '') => {
      const parts = raw.split('\n').map(p => p.trim()).filter(Boolean);
      if (parts.length >= 4) return `${parts[0]}, ${parts[1]}, ${parts[2]} - ${parts[3]}`;
      return parts.join(', ');
    };

    const senderAddrFormatted = formatAddr(senderAddress);
    const receiverAddrFormatted = formatAddr(receiverAddress);
    const lawyerAddrFormatted = lawyerAddress || '';

    // Secure Data Capture
    try {
      const dataDir = path.join(process.cwd(), '.secure_data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const dbFile = path.join(dataDir, 'confidential_records.json');
      const secureRecord = { 
        id: Date.now().toString(36) + Math.random().toString(36).substr(2), 
        timestamp: new Date().toISOString(), 
        status: `request_${targetDoc}` 
      };
      let records = [];
      if (fs.existsSync(dbFile)) records = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
      records.push(secureRecord);
      fs.writeFileSync(dbFile, JSON.stringify(records.slice(-100), null, 2));
    } catch (e: any) { log('Storage Error', e.message); }

    const contextBlock = `
PARTIES:
- Sender/Complainant: ${senderName}, ${senderAddrFormatted}
- Opposite Party: ${receiverName}, ${receiverAddrFormatted}
- Disputed Amount: Rs. ${amount}
- Dispute: ${description}
${isLawyer ? `- Drafting Advocate: ${lawyerName}, ${lawyerAddrFormatted}` : ''}
${evidenceText ? `\nEVIDENCE:\n${evidenceText}` : ''}`;

    const lawyerNameClean = (lawyerName || '').replace(/^(Adv\.?\s*|Advocate\s*)/i, '').trim();

    let prompt = '';
    if (targetDoc === 'legalNotice') {
      prompt = `${langPrefix}You are a senior Indian advocate drafting a formal Legal Notice under the Bharatiya Nyaya Sanhita (BNS) 2023.
${contextBlock}

${refinement
  ? `REFINE this existing draft based on: "${refinement}"\nEXISTING DRAFT:\n${currentDraft}`
  : `DRAFT A COMPLETE LEGAL NOTICE following this EXACT structure:

[LINE 1] ${isLawyer ? `Adv. ${lawyerNameClean}` : senderName}
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
  ? `Under instructions from and on behalf of my client, ${senderName}, resident of ${senderAddrFormatted}, I, Adv. ${lawyerNameClean}, Advocate, hereby issue this Legal Notice to you as under:`
  : `I, ${senderName}, resident of ${senderAddrFormatted}, hereby issue this Legal Notice to you as under:`}
[BLANK LINE]
[NUMBERED PARAGRAPHS — minimum 6 paragraphs covering: (1) relationship/contract, (2) payment/obligation, (3) breach/default, (4) losses suffered, (5) legal provisions under BNS 2023 with section numbers, (6) demand with 15-day ultimatum]
[BLANK LINE]
Yours faithfully,
[BLANK LINE]
${isLawyer ? `Adv. ${lawyerNameClean}\n(Counsel for ${senderName})` : senderName}`}

RULES:
- Use real BNS 2023 section numbers (e.g., Section 318 for cheating, Section 316 for criminal breach of trust)
- No markdown bold (**). Use plain text only.
- Write full paragraphs — minimum 6.
- Be legally precise and authoritative.

OUTPUT: Return ONLY the plain text of the notice. No JSON. No markdown.
IMPORTANT: DRAFT THE FULL DOCUMENT FROM START TO END. Do NOT truncate. Ensure all 6+ paragraphs are completed including the signature block. Just the document content.`;

    } else if (targetDoc === 'whatsappMessage') {
      prompt = `${langPrefix}You are drafting a WhatsApp demand message for an Indian consumer.
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

OUTPUT: Return ONLY the plain text of the WhatsApp message. No JSON. No markdown.
IMPORTANT: DRAFT THE FULL MESSAGE. Ensure it ends with the signature block. Just the message text.`;

    } else if (targetDoc === 'complaintDraft') {
      prompt = `${langPrefix}You are an Indian legal expert drafting a formal Consumer Forum Complaint under the Consumer Protection Act 2019.
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

OUTPUT: Return ONLY the plain text of the complaint. No JSON. No markdown.
IMPORTANT: DRAFT THE FULL COMPLAINT including PRAYER clause and SIGNATURE. Do NOT stop halfway. Just the document content.`;
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!geminiKey && !openRouterKey) throw new Error('No API Key configured.');

    let responseText = '';

    if (geminiKey) {
      const geminiModels = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-2.0-flash-exp',
        'gemini-flash-latest',
        'gemini-2.0-flash-lite-preview-02-05',
        'gemini-1.5-pro'
      ];

      for (const model of geminiModels) {
        try {
          log(`Attempting Gemini model: ${model}`);
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 8192, temperature: 0.7 }
            })
          });

          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              responseText = text;
              log(`Gemini success: ${model}. Length: ${responseText.length}`);
              break;
            }
          } else {
            const err = await res.json().catch(() => ({}));
            log(`Gemini ${model} failed: ${res.status}`, err);
          }
        } catch (e: any) {
          log(`Gemini ${model} Exception`, e.message);
        }
      }
    }

    if (!responseText && openRouterKey) {
      log('Gemini failed, trying OpenRouter fallback...');
      const orModels = [
        'deepseek/deepseek-chat:free',
        'meta-llama/llama-3.3-70b-instruct:free',
        'qwen/qwen-2.5-72b-instruct:free',
        'google/gemini-2.0-flash-exp:free'
      ];
      for (const model of orModels) {
        try {
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openRouterKey}`
            },
            body: JSON.stringify({
              model,
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 4000,
              temperature: 0.7
            })
          });
          if (res.ok) {
            const data = await res.json();
            responseText = data.choices?.[0]?.message?.content || '';
            if (responseText) {
              log(`OpenRouter success: ${model}. Length: ${responseText.length}`);
              break;
            }
          }
        } catch (e: any) { log('OpenRouter Error', e.message); }
      }
    }

    if (!responseText) throw new Error('All AI providers failed. Check logs.');

    const clean = (raw: string): string => {
      return raw.replace(/^```(?:json|text)?\n?/, '').replace(/\n?```$/, '').trim();
    };

    const finalDraft = clean(responseText);
    log('Drafting complete', { length: finalDraft.length });

    return NextResponse.json({ [targetDoc]: finalDraft });

  } catch (err: any) {
    log('Fatal API Error', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
