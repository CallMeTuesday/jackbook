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
