import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const CHAT_MIN_COST = 1;
const CHAT_TOKEN_RATE = 1000; // 1 credit per 1000 tokens

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { message, chatHistory, currentDraft, targetDoc } = await req.json();

    // Check Credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    });

    if (!user || (user.credits || 0) < CHAT_MIN_COST) {
      return NextResponse.json({ 
        error: 'Insufficient credits. Upgrade to continue chatting.',
        outOfCredits: true 
      }, { status: 403 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error('Gemini API Key not configured');

    let totalTokens = 0;
    let modelUsed = '';

    const prompt = `You are an Indian legal assistant (AI Co-pilot) helping a user refine a ${targetDoc || 'legal draft'}.
CURRENT DRAFT:
${currentDraft}

USER MESSAGE: "${message}"

CHAT HISTORY:
${(chatHistory || []).map((m: any) => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}

YOUR GOAL:
1. Act as a conversational, helpful AI lawyer. 
2. If the user is just asking a question (e.g. "is this legal?", "what does this mean?"), answer them without updating the document yet.
3. If the user asks for a specific change (e.g. "change amount to 10L", "fix spelling", "add section 420"), explain how you will do it and signal that the document needs an update.
4. If you suggest a change, check with the user first unless they explicitly asked you to "change it".

OUTPUT FORMAT: Return ONLY a valid JSON object with EXACTLY these two fields:
{
  "reply": "Your conversational response to the user here.",
  "shouldUpdateDraft": true/false (true ONLY if the user explicitly asked for a change to the document content or if you have enough info to perform the change right now)
}

Be professional, authoritative, and concise. Do NOT use markdown in the JSON string values.`;

    const geminiModels = [
      'gemini-2.0-flash',
      'gemini-flash-latest',
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-2.0-flash-lite-preview-02-05',
      'gemini-1.5-pro'
    ];

    let text = '';
    
    for (const model of geminiModels) {
      try {
        console.log(`[CHAT API] Attempting Gemini model: ${model}`);
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
                maxOutputTokens: 1024, 
                temperature: 0.7 
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const t = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (t) {
            text = t;
            totalTokens = data.usageMetadata?.totalTokenCount || 0;
            modelUsed = model;
            break; 
          }
        }
      } catch (e: any) {
        console.error(`[CHAT API] Error calling ${model}:`, e.message);
      }
    }
    
    if (!text) throw new Error('No successful response from any AI model.');
    
    text = text.trim();
    if (text.startsWith('```')) {
      text = text.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    }

    try {
      const parsed = JSON.parse(text);
      
      const calcCost = Math.max(CHAT_MIN_COST, Math.ceil(totalTokens / CHAT_TOKEN_RATE));

      // Deduct Credit and Log Transaction on Success
      const [updatedUser] = await prisma.$transaction([
          prisma.user.update({
              where: { id: session.user.id },
              data: { credits: { decrement: calcCost } }
          }),
          prisma.creditTransaction.create({
              data: {
                  userId: session.user.id,
                  amount: -calcCost,
                  type: 'chat',
                  docType: targetDoc || 'chat-assistant',
                  tokens: totalTokens
              }
          })
      ]);

      return NextResponse.json({ ...parsed, remainingCredits: updatedUser.credits, usage: { tokens: totalTokens, cost: calcCost } });
    } catch (parseErr) {
      console.error('[JSON Parse Error] Raw text:', text);
      
      const calcCost = Math.max(CHAT_MIN_COST, Math.ceil(totalTokens / CHAT_TOKEN_RATE));
      
      const [updatedUser] = await prisma.$transaction([
          prisma.user.update({
              where: { id: session.user.id },
              data: { credits: { decrement: calcCost } }
          }),
          prisma.creditTransaction.create({
              data: {
                  userId: session.user.id,
                  amount: -calcCost,
                  type: 'chat',
                  docType: targetDoc || 'chat-assistant-fallback',
                  tokens: totalTokens
              }
          })
      ]);

      // Fallback as string if JSON fails
      return NextResponse.json({ reply: text, shouldUpdateDraft: false, usage: { tokens: totalTokens, cost: calcCost }, remainingCredits: updatedUser.credits });
    }

  } catch (err: any) {
    console.error('[CHAT API] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
