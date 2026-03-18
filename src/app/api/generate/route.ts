import { NextResponse } from 'next/server';

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
    } = body;

    // We can try calling an external API if key is set, otherwise use an advanced mock 
    // to provide the MVP experience right away without configuration blocks.
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (apiKey) {
      // Implement OpenRouter/Groq API Call
      const prompt = `Act as an Indian legal expert. Draft a formal legal notice based on the following details:\n
        Issue Type: ${issueType}\n
        Sender: ${senderName}\n
        Receiver: ${receiverName}\n
        Amount: ${amount}\n
        Service Details: ${serviceDetails}\n
        Description: ${description}\n\n
        Ensure:\n- Professional legal tone\n- Clear demand and deadline\n- Indian legal context\n
        Output ONLY a JSON object with 'legalNotice', 'whatsappMessage', 'complaintDraft' string keys without markdown formatting.`;
        
      try {
        const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3-8b-instruct:free',
            messages: [{ role: 'user', content: prompt }]
          })
        });
        
        const data = await aiResponse.json();
        
        let content = data.choices?.[0]?.message?.content;
        
        if (content) {
            // strip potential markdown codeblocks
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(content);
            return NextResponse.json(parsed);
        }
      } catch (err) {
        console.error("AI Generation Failed, falling back to mock", err);
      }
    }

    // Advanced Mock for MVP Delivery Reliability
    const currentYear = new Date().getFullYear();
    const defaultAmountText = amount ? `Rs. ${amount}/-` : 'the relevant amount';
    
    const mockLegalNotice = `LEGAL NOTICE\n\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nTo,\n${receiverName || 'The Concerned Party'}\n\nSub: Legal Notice for ${issueType}\n\nUnder instructions from and on behalf of my client ${senderName}, I hereby serve upon you the following legal notice:\n\n1. That my client engaged your services/purchased for ${serviceDetails || 'the agreed purpose'}.\n2. That despite taking the payment of ${defaultAmountText} on ${paymentDate || 'agreed dates'}, you have failed to deliver on your promises by ${deliveryDate || 'the agreed timeframe'}.\n3. ${description || 'You have engaged in unfair trade practices and deficiency of service.'}\n4. You are hereby called upon to address this grievance within 15 days of receiving this notice, failing which my client shall be constrained to initiate civil and criminal proceedings against you under the applicable laws of India at your cost and consequences.\n\nYours faithfully,\n\nAdvocate for ${senderName}`;
    
    const mockWhatsappMessage = `Dear ${receiverName},\n\nThis is regarding the ${issueType} for ${serviceDetails}. I had paid ${defaultAmountText} on ${paymentDate}, but the commitment for ${deliveryDate} was not met.\n\n${description ? description.substring(0, 100) + '...' : ''}\n\nPlease resolve this issue and process the requested refund/delivery within 3 days to avoid formal legal action. I hope we can resolve this amicably.\n\nRegards,\n${senderName}`;
    
    const mockComplaintDraft = `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION\n\nIN THE MATTER OF:\n${senderName} ... Complainant\n\nVERSUS\n\n${receiverName} ... Opposite Party\n\nCOMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019\n\nMOST RESPECTFULLY SHOWETH:\n1. That the Complainant is a consumer who engaged the services of the Opposite Party for ${serviceDetails}.\n2. That the Opposite Party has committed deficiency in service relating to ${issueType}.\n3. That the complainant paid ${defaultAmountText} on ${paymentDate}.\n4. Cause of action arose when Opposite Party failed to deliver by ${deliveryDate}.\n\nPRAYER:\nIn view of the above facts, it is prayed that the Opposite Party be directed to refund the amount along with 18% interest and compensation for mental agony.\n\nDate: ____________\nPlace: ____________\nComplainant: ${senderName}`;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      legalNotice: mockLegalNotice,
      whatsappMessage: mockWhatsappMessage,
      complaintDraft: mockComplaintDraft
    });

  } catch (error) {
    console.error("Error generating notice:", error);
    return NextResponse.json({ error: "Failed to generate notices" }, { status: 500 });
  }
}
