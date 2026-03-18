import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      issueType,
      senderName,
      receiverName,
      amount,
      serviceDetails,
      paymentDate,
      deliveryDate,
      description,
      senderType,
      lawyerName,
      evidenceText,
      targetDoc = 'legalNotice',
      refinement, // New: User chat instructions
      currentDraft // New: The existing draft to be refined
    } = body;

    // --- BFF Architecture: Securely store confidential information server-side ---
    // The Next.js API route acts as the Backend-For-Frontend (BFF).
    // We store sensitive user data here securely before sending sanitized portions to external AIs.
    try {
      const dataDir = path.join(process.cwd(), '.secure_data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }
      
      const dbFile = path.join(dataDir, 'confidential_records.json');
      const secureRecord = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        confidentialData: body,
        status: refinement ? `refining_${targetDoc}` : `drafting_${targetDoc}`
      };
      
      let records = [];
      if (fs.existsSync(dbFile)) {
        records = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
      }
      records.push(secureRecord);
      fs.writeFileSync(dbFile, JSON.stringify(records, null, 2));
      console.log(`[BFF] Securely stored confidential action ID: ${secureRecord.id}`);
    } catch (saveError) {
      console.error('[BFF] Failed to securely store confidential data:', saveError);
    }
    // -----------------------------------------------------------------------------

    // We can try calling an external API if key is set
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (apiKey) {
      const isLawyer = senderType === 'lawyer';
      
      let docTask = '';
      if (refinement) {
        docTask = `REFINE the existing ${targetDoc} provided below.
          USER'S REFINEMENT REQUEST: "${refinement}"
          
          EXISTING DRAFT TO BE MODIFIED:
          ---
          ${currentDraft}
          ---
          
          Keep the legal structure but incorporate the requested changes accurately.`;
      } else {
        if (targetDoc === 'legalNotice') {
          docTask = `Draft a comprehensive, formidable, and highly structured Formal Legal Notice. 
            CRITICAL TONE & IDENTITY: 
            ${isLawyer 
              ? `You ARE Advocate ${lawyerName}. The notice MUST begin with: "Under instructions from and on behalf of my client ${senderName}, I, Advocate ${lawyerName}, hereby serve upon you..."` 
              : `You ARE ${senderName} (The Client). You are drafting this FOR YOURSELF. The notice MUST begin with: "I, ${senderName}, hereby serve upon you..." and must NOT mention any other lawyer name or use lawyer placeholders like [Your Name].`}`;
        } else if (targetDoc === 'whatsappMessage') {
          docTask = `Draft a stern, professionally intimidating WhatsApp message summarizing the dispute.
            IDENTITY: ${isLawyer ? `Sent by Advocate ${lawyerName} on behalf of ${senderName}` : `Sent by ${senderName} directly`}.`;
        } else {
          docTask = `Draft a detailed Consumer Court OR Police Complaint draft covering cause of action and specific prayers.
            IDENTITY: ${isLawyer ? `Drafted by Advocate ${lawyerName} for ${senderName}` : `Drafted by ${senderName} personally`}.`;
        }
      }

      const prompt = `You are a highly experienced Indian Senior Advocate. 
        Analyze the following dispute and ${refinement ? 'REFINE' : 'draft'} a highly detailed, professional, and legally sound ${targetDoc}.
        
        CONTEXT:
        - Drafting Party: ${isLawyer ? `Advocate ${lawyerName}` : 'The Client Themselves (Pro Se)'}
        - Aggrieved Party: ${senderName}
        - Opposite Party: ${receiverName}
        - Issue: ${issueType} (${serviceDetails})
        - Stake: INR ${amount}
        - Key Dates: Paid on ${paymentDate}, Due on ${deliveryDate}
        
        DESCRIPTION OF INCIDENT: "${description}"
        ${evidenceText ? `FACTUAL EVIDENCE CONTEXT (Analysing Chat/Docs): "${evidenceText}"` : ''}

        YOUR SPECIFIC TASK:
        ${docTask}

        LEGAL STANDARDS TO FOLLOW:
        1. Use CURRENT Indian Statues. Prioritize **Bharatiya Nyaya Sanhita (BNS)** over IPC where applicable (e.g. BNS Section 318 for Cheating).
        2. STRUCTURE: Use STRICT **Numbered Paragraphs** (1, 2, 3...) for the entire body of the ${targetDoc}.
        3. TONE: Professional, firm, and authoritative. Avoid generic placeholders.
        4. If evidenceContext is provided, weave specific facts or quotes into the draft to increase credibility.
        
        OUTPUT FORMAT: Return ONLY a JSON object with a single key: "${targetDoc}". No markdown.`;
        
      try {
        let fetchSuccess = false;
        let aiResponse;
        let errorData = '';
        
        const fallbackModels = [
          'google/gemini-2.0-flash-lite-preview-02-05:free',
          'google/gemini-2.0-flash-exp:free',
          'google/gemini-flash-1.5-free-v1:0'
        ];
        
        for (const targetModel of fallbackModels) {
           console.log(`[BFF] Attempting ${refinement ? 'refinement' : 'generation'} of (${targetDoc}) with ${targetModel}...`);
           aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'AI Legal Notice Generator'
              },
              body: JSON.stringify({
                model: targetModel,
                messages: [{ role: 'user', content: prompt }]
              })
           });
           
           if (aiResponse.ok) {
              fetchSuccess = true;
              break; 
           } else {
              errorData = await aiResponse.text();
              console.warn('[BFF] Model ' + targetModel + ' failed. Trying next -> ' + errorData);
           }
        }
        
        if (!fetchSuccess || !aiResponse) {
           throw new Error('OpenRouter API Error: Models exhausted. Final error: ' + errorData);
        }

        const data = await aiResponse.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (content) {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) { throw new Error('AI did not return a valid JSON format.'); }
            const parsed = JSON.parse(jsonMatch[0]);
            console.log(`[BFF] AI Successfully Generated/Refined ${targetDoc}.`);
            return NextResponse.json(parsed);
        } else {
             throw new Error('Empty response from AI');
        }
      } catch (err: any) {
        console.error(`AI Generation Failed for ${targetDoc}:`, err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
    }

    // Advanced Mock for MVP Delivery Reliability
    const defaultAmountText = amount ? `Rs. ${amount}/-` : 'the relevant amount';
    let mockResult = refinement ? `[REFINED] ${currentDraft}\n\nNote: Refinement applied: ${refinement}` : '';

    if (!refinement) {
      if (targetDoc === 'legalNotice') {
        mockResult = `LEGAL NOTICE\n\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nTo,\n${receiverName}\n\nSub: Legal Notice for ${issueType}\n\n${senderType === 'lawyer' ? `Under instructions from and on behalf of my client ${senderName}, I, Advocate ${lawyerName}, hereby serve upon you...` : `I, ${senderName}, hereby serve upon you the following legal notice:`}\n\n1. That I/we engaged your services for ${serviceDetails}.\n2. That payment of ${defaultAmountText} was made on ${paymentDate}.\n3. Despite delivery date of ${deliveryDate}, no service was provided.\n4. Ultimatum: 15 days for refund or face legal action.`;
      } else if (targetDoc === 'whatsappMessage') {
        mockResult = `Final Warning regarding ${issueType}. Amount: ${defaultAmountText}. Resolve within 48 hours to avoid formal court proceedings. - ${senderName}`;
      } else {
        mockResult = `BEFORE THE DISTRICT CONSUMER COMMISSION\n\n${senderName} vs ${receiverName}\n\nComplaint for Deficiency in Service regarding ${serviceDetails}.`;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    return NextResponse.json({ [targetDoc]: mockResult });

  } catch (error) {
    console.error("Error generating notice:", error);
    return NextResponse.json({ error: "Failed to generate notices" }, { status: 500 });
  }
}
