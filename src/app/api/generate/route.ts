import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      senderName, senderAddress, receiverName, receiverAddress,
      amount, description, senderType, lawyerName, lawyerAddress,
      evidenceText, language = 'en', targetDoc = 'legalNotice',
      refinement, currentDraft, lawyerLogo, lawyerStamp,
      courtName, complaintNumber
    } = body;

    console.log('[BFF] Start Request', { targetDoc, language, isLawyer: senderType === 'lawyer' });

    const LANGUAGE_NAMES: Record<string, string> = {
      en: 'English', hi: 'Hindi (हिंदी)', mr: 'Marathi (મરાઠી)',
      bn: 'Bengali (বাংলা)', ta: 'Tamil (தமிழ்)', te: 'Telugu (తెલોગુ)',
      gu: 'Gujarati (ગુજરાતી)', kn: 'Kannada (ಕನ್ನಡ)',
      pa: 'Punjabi (ਪੰਜਾਬੀ)', ml: 'Malayalam (മലയാളം)',
    };
    const langName = LANGUAGE_NAMES[language] || 'English';
    const langPrefix = `ABSOLUTE REQUIREMENT: Write this ENTIRE document (including headers, greetings, introductory paragraphs, and closing) in ${langName} language. `;

    const isLawyer = !!lawyerName && senderType === 'lawyer';

    const formatAddr = (raw: string = '') => {
      const parts = raw.split('\n').map(p => p.trim()).filter(Boolean);
      if (parts.length >= 4) return `${parts[0]}, ${parts[1]}, ${parts[2]} - ${parts[3]}`;
      return parts.join(', ');
    };

    const senderAddrFormatted = formatAddr(senderAddress);
    const receiverAddrFormatted = formatAddr(receiverAddress);
    const lawyerAddrFormatted = lawyerAddress || '';

    const contextBlock = `
PARTIES:
- Sender/Complainant: ${senderName || '[SENDER NAME]'}, ${senderAddrFormatted || '[SENDER ADDRESS]'}
- Opposite Party: ${receiverName || '[OPPOSITE PARTY NAME]'}, ${receiverAddrFormatted || '[OPPOSITE PARTY ADDRESS]'}
- Dispute: ${description}
${courtName ? `- Court: ${courtName}` : ''}
${complaintNumber ? `- Case/Complaint Reference: ${complaintNumber}` : ''}
${amount ? `- Disputed Amount: Rs. ${amount}` : ''}
${isLawyer ? `- Drafting Advocate: ${lawyerName}, ${lawyerAddrFormatted}` : ''}
${evidenceText ? `\nEVIDENCE:\n${evidenceText}` : ''}`;

    const lawyerNameClean = (lawyerName || '').replace(/^(Adv\.?\s*|Advocate\s*)/i, '').trim();

    let prompt = '';
    if (targetDoc === 'legalNotice') {
      prompt = `${langPrefix}You are a senior Indian advocate drafting a formal Legal Notice under the Bharatiya Nyaya Sanhita (BNS) 2023.
${contextBlock}

${refinement
  ? `REFINE this existing draft based on: "${refinement}"\nEXISTING DRAFT:\n${currentDraft}`
  : `DRAFT A COMPLETE LEGAL NOTICE in the absolute strictly professional and formal layout of an Indian Advocate's Legal Notice.

Use the following strict structural template (Do NOT use markdown bold/italics, just standard plain text but spaced properly with newlines):

REGISTERED A.D. / SPEED POST

Ref. No. ............                                         Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

FROM:
${isLawyer ? `Advocate ${lawyerNameClean}\n${lawyerAddrFormatted}` : `${senderName || '[SENDER NAME]'}\n${senderAddrFormatted || '[SENDER ADDRESS]'}`}

TO,
${receiverName || '[RECIPIENT NAME]'},
${receiverAddrFormatted || '[RECIPIENT ADDRESS]'}

SUBJECT: STATUTORY LEGAL NOTICE UNDER BHARATIYA NYAYA SANHITA 2023 REGARDING [Insert specific context based on facts e.g. RECOVERY OF DUES / BREACH OF CONTRACT].

Sir/Madam,

${isLawyer
  ? `Under specific instructions from and on behalf of my client, ${senderName || '[SENDER NAME]'}, resident of ${senderAddrFormatted || '[SENDER ADDRESS]'} (hereinafter referred to as "my client"), I address you as follows:`
  : `I, ${senderName || '[SENDER NAME]'}, resident of ${senderAddrFormatted || '[SENDER ADDRESS]'}, hereby serve upon you the following Legal Notice:`}

1. That [Start the facts chronologically].
2. That [Detail the transaction/relationship and financial considerations].
3. That [Detail the breach/offense and specific damages].
4. That [Detail the repeated attempts to resolve, and your failure to comply].
5. That the aforesaid acts of omission and commission on your part clearly amount to offenses including but not limited to Criminal Breach of Trust and Cheating, punishable under relevant sections of the Bharatiya Nyaya Sanhita (BNS) 2023 [Include specific sections like 316, 318 if applicable along with how the facts apply].
6. That my client has suffered tremendous mental agony, harassment, and financial loss due to your illegal, fraudulent and malafide actions for which you are liable to compensate.

I therefore, by means of this legal notice, call upon you to [Demand action e.g. clear the outstanding amount / perform specific act] along with Rs. 15,000/- towards the cost of this legal notice, within 15 days from the receipt of this notice. 

In the event of your failure to comply with this notice within the stipulated period of 15 days, my client has given me clear instructions to initiate appropriate civil and criminal proceedings against you in the competent court of law, entirely at your own risk, cost and consequences.

A copy of this notice is kept in my office for future legal reference.

Yours faithfully,

___________________
${isLawyer ? `Advocate ${lawyerNameClean}\nCounsel for ${senderName || '[SENDER NAME]'}` : `${senderName || '[SENDER NAME]'}`}
`}

RULES:
- Use real BNS 2023 section numbers (e.g., Section 318 for cheating, Section 316 for criminal breach of trust)
- No markdown bold (**). Use plain text only.
- Write full paragraphs — minimum 6.
- Be legally precise and authoritative.

OUTPUT: Return ONLY basic HTML formatted text. Use <p> tags for paragraphs, <br> for line breaks, and <strong> for bolding. Do NOT wrap in \`\`\`html markdown blocks. Output pure HTML markup that is ready to be rendered in a rich text editor.
IMPORTANT: DRAFT THE FULL DOCUMENT FROM START TO END. Do NOT truncate. Ensure all 6+ paragraphs are completed including the signature block. Just the HTML document content.`;

    } else if (targetDoc === 'whatsappMessage') {
      prompt = `${langPrefix}You are drafting a WhatsApp demand message for an Indian consumer.
${contextBlock}

${refinement
  ? `REFINE this existing draft based on: "${refinement}"\nEXISTING:\n${currentDraft}`
  : `Write a firm, professional WhatsApp message from ${senderName || '[SENDER NAME]'} to ${receiverName || '[RECIPIENT NAME]'}.
  
STRUCTURE:
- Opening: State who you are and the issue directly
- Middle: Key facts (dates, amount paid, what was promised, what happened)
- Demand: Clear ask — refund Rs. ${amount || '[AMOUNT]'} within [7 days] or you will file a police complaint + consumer forum case
- Closing: Your contact or final warning

TONE: Firm, professional, and official. No slang. No emojis. Plain text only.
LENGTH: Under 300 words. Short paragraphs suitable for WhatsApp.`}

OUTPUT: Return ONLY the plain text of the WhatsApp message. No JSON. No markdown.
IMPORTANT: DRAFT THE FULL MESSAGE. Ensure it ends with the signature block. Just the message text.`;

    } else if (targetDoc === 'complaintDraft') {
      prompt = `${langPrefix}You are an Indian legal expert drafting a formal Court Criminal Complaint under the Code of Criminal Procedure, 1973 / BNSS 2023.
${contextBlock}

${refinement
  ? `REFINE this existing draft based on: "${refinement}"\nEXISTING:\n${currentDraft}`
  : `Draft a strict, formal Court Criminal Complaint.

STRUCTURE TO FOLLOW (Do NOT use markdown bold/italics, just standard plain text but spaced properly with newlines):

IN THE COURT OF THE ${courtName || '[COURT NAME]'}
CRIMINAL COMPLAINT NO. ${complaintNumber || '[_______]'} OF ${new Date().getFullYear()}

IN THE MATTER OF:

${senderName || '[COMPLAINANT NAME]'} S/o/D/o/W/o [FATHER/HUSBAND NAME], Aged about [AGE] years, Residing at ${senderAddrFormatted || '[COMPLAINANT ADDRESS]'} ... COMPLAINANT

VERSUS

${receiverName || '[ACCUSED NAME]'} S/o/D/o/W/o [FATHER/HUSBAND NAME], Aged about [AGE] years, Residing at ${receiverAddrFormatted || '[ACCUSED ADDRESS]'} ... ACCUSED

COMPLAINT UNDER SECTION 200 OF THE CODE OF CRIMINAL PROCEDURE, 1973 (OR RELEVANT BNSS 2023 SECTION) FOR OFFENCES PUNISHABLE UNDER RELEVANT SECTIONS OF THE BHARATIYA NYAYA SANHITA (BNS) 2023 / IPC 1860.

MOST RESPECTFULLY SHOWETH:

SYNOPSIS
That the present complaint is being filed by the Complainant against the Accused for the offence of [Describe offence based on facts e.g. cheating, breach of trust, etc.], wherein the Accused, with a clear fraudulent intention, induced the Complainant to... [Summarize the issue briefly causing wrongful loss].

FACTS OF THE CASE:
1. That the Complainant is a law-abiding citizen and a resident of ${senderAddrFormatted || '[COMPLAINANT ADDRESS]'}.
2. That the Accused, ${receiverName || '[ACCUSED NAME]'}, holds himself/herself out as [Describe Accused briefly based on facts].
3. That [Continue the facts chronologically in numbered paragraphs].
4. That [Detail the financial consideration, amount paid, dates].
5. That [Detail the breach or failure to provide service/goods and absconding or refusal behaviour].
6. That the aforesaid acts of omission and commission clearly amount to serious criminal offenses demonstrating a pre-meditated design to defraud the Complainant, warranting immediate judicial intervention.

PRAYER:
In view of the above facts and circumstances, it is most respectfully prayed that this Hon'ble Court may be pleased to:
(a) Take cognizance of the offences committed by the Accused under relevant sections of the BNS 2023 / IPC;
(b) Summon, try and severely punish the Accused in accordance with the law;
(c) Direct the Accused to pay compensation to the Complainant; and
(d) Pass any other order(s) as this Hon'ble Court may deem fit and proper in the interest of justice.

PLACE: [City]
DATE: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

                                         (${senderName || '[COMPLAINANT NAME]'})
                                         COMPLAINANT
                                         
THROUGH COUNSEL: ___________________`}

OUTPUT: Return ONLY basic HTML formatted text. Use <p> tags for paragraphs, <br> for line breaks, and <strong> for bolding. Do NOT wrap in \`\`\`html markdown blocks. Output pure HTML markup that is ready to be rendered in a rich text editor.
IMPORTANT: DRAFT THE FULL COMPLAINT including PRAYER clause and SIGNATURE. Do NOT stop halfway. Just the HTML document content.`;

    } else if (targetDoc === 'emailDraft') {
      prompt = `${langPrefix}You are drafting a formal Legal Email Notice.
${contextBlock}

${refinement
  ? `REFINE this existing draft based on: "${refinement}"\nEXISTING DRAFT:\n${currentDraft}`
  : `Draft a complete formal Legal Email.

STRUCTURE TO FOLLOW:
Subject: FORMAL NOTICE: [Issue Summary] | WITHOUT PREJUDICE

Dear ${receiverName || '[RECIPIENT NAME]'},

[INTRODUCTORY PARAGRAPH]:
This email serves as a formal written notice regarding the ongoing dispute.

[Numbered body paragraphs detailing the facts, obligations, breach, and amounts owed]

[Demand for resolution within a specific timeframe (e.g., 7-14 days)]

[Warning of further legal action, including consumer court or civil/criminal proceedings]

Sincerely,
${isLawyer ? `Adv. ${lawyerNameClean}\nCounsel for ${senderName || '[SENDER NAME]'}` : (senderName || '[SENDER NAME]')}`}

OUTPUT: Return ONLY the plain text of the email. No JSON. No markdown.
IMPORTANT: DRAFT THE FULL EMAIL from Subject line to Signature.`;
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!geminiKey && !openRouterKey) throw new Error('No API Key configured.');

    let responseText = '';

    if (geminiKey) {
      const geminiModels = [
        'gemini-2.0-flash',
        'gemini-flash-latest',
        'gemini-2.0-flash-exp',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-2.0-flash-lite-preview-02-05',
        'gemini-1.5-pro'
      ];

      for (const model of geminiModels) {
        try {
          console.log(`[BFF] Attempting Gemini model: ${model}`);
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
              console.log(`[BFF] Gemini success: ${model}. Length: ${responseText.length}`);
              break;
            }
          } else {
            const err = await res.json().catch(() => ({}));
            console.log(`[BFF] Gemini ${model} failed: ${res.status}`, JSON.stringify(err));
          }
        } catch (e: any) {
          console.log(`[BFF] Gemini ${model} Exception`, e.message);
        }
      }
    }

    if (!responseText && openRouterKey) {
      console.log('[BFF] Gemini failed, trying OpenRouter fallback...');
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
              console.log(`[BFF] OpenRouter success: ${model}. Length: ${responseText.length}`);
              break;
            }
          }
        } catch (e: any) { console.log('[BFF] OpenRouter Error', e.message); }
      }
    }

    if (!responseText) throw new Error('All AI providers failed. Check server logs.');

    const clean = (raw: string): string => {
      return raw.replace(/^```(?:json|text)?\n?/, '').replace(/\n?```$/, '').trim();
    };

    const finalDraft = clean(responseText);
    console.log('[BFF] Drafting complete', { length: finalDraft.length });

    return NextResponse.json({ [targetDoc]: finalDraft });

  } catch (err: any) {
    console.log('[BFF] Fatal API Error', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
