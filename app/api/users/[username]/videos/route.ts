import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const user = await prisma.user.findUnique({ where: { username: params.username }, select: { id: true } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const premium = req.nextUrl.searchParams.get('premium') === 'true'

  const submissions = await prisma.submission.findMany({
    where: { userId: user.id, status: 'approved', isPremium: premium },
    orderBy: { createdAt: 'desc' },
    select: { id: true, videoId: true, moveName: true, moveId: true, isPremium: true, createdAt: true },
  })

  return NextResponse.json({ submissions })
}
