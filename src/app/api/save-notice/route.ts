import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { noticeId, content, type, language, formData, title } = body;

    if (!content || !type) {
      return NextResponse.json({ error: 'content and type are required' }, { status: 400 });
    }

    // Require authenticated session to save
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized, please sign in' }, { status: 401 });
    }
    const userId = session.user.id;

    let notice;
    if (noticeId) {
      // Update existing notice (add additional doc types)
      notice = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          content,
          updatedAt: new Date(),
        }
      });
    } else {
      // Create new notice record
      const issueType = (formData as any)?.issueType || 'General';
      const receiverName = (formData as any)?.receiverName || 'Recipient';
      notice = await prisma.notice.create({
        data: {
          title: title || `${issueType} — Notice to ${receiverName}`,
          content,
          type,
          language: language || 'en',
          formData: formData || {},
          userId,
        }
      });
    }

    return NextResponse.json({ success: true, noticeId: notice.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
