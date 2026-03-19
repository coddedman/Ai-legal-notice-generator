import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ totalNotices: 0, whatsappDrafts: 0, legalNotices: 0, complaintDrafts: 0 });
    }

    const [totalNotices, whatsappDrafts, legalNotices, complaintDrafts, user] = await Promise.all([
      prisma.notice.count({ where: { userId: session.user.id } }),
      prisma.notice.count({ where: { userId: session.user.id, type: 'whatsappMessage' } }),
      prisma.notice.count({ where: { userId: session.user.id, type: 'legalNotice' } }),
      prisma.notice.count({ where: { userId: session.user.id, type: 'complaintDraft' } }),
      prisma.user.findUnique({ where: { id: session.user.id }, select: { createdAt: true } })
    ]);

    return NextResponse.json({
      totalNotices,
      whatsappDrafts,
      legalNotices,
      complaintDrafts,
      memberSince: user?.createdAt || null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
