import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const moveId = new URL(request.url).searchParams.get('moveId')

  const saved = await prisma.savedVideo.findMany({
    where: { userId: session.user.id, ...(moveId ? { moveId } : {}) },
    orderBy: { createdAt: 'desc' },
  })

  // Attach move style (only needed for full list, not per-move queries)
  if (!moveId && saved.length > 0) {
    const moveIds = [...new Set(saved.map((v) => v.moveId))]
    const moves = await prisma.move.findMany({
      where: { id: { in: moveIds } },
      select: { id: true, style: true },
    })
    const styleMap = Object.fromEntries(moves.map((m) => [m.id, m.style]))
    const savedWithStyle = saved.map((v) => ({ ...v, moveStyle: styleMap[v.moveId] ?? 'house' }))
    return NextResponse.json({ saved: savedWithStyle })
  }

  return NextResponse.json({ saved })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { moveId, moveName, videoId, videoTitle, videoThumb, channelTitle } = await request.json()

  if (!moveId || !moveName || !videoId || !videoTitle || !videoThumb || !channelTitle) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const existing = await prisma.savedVideo.findUnique({
    where: { userId_videoId_moveId: { userId: session.user.id, videoId, moveId } },
  })

  if (existing) {
    await prisma.savedVideo.delete({ where: { id: existing.id } })
    return NextResponse.json({ saved: false })
  }

  await prisma.savedVideo.create({
    data: { userId: session.user.id, moveId, moveName, videoId, videoTitle, videoThumb, channelTitle },
  })

  return NextResponse.json({ saved: true })
}
