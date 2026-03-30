import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { moveName, videoUrl, note, moveId } = body

  if (!moveName?.trim() || !videoUrl?.trim()) {
    return NextResponse.json({ error: 'moveName and videoUrl are required' }, { status: 400 })
  }

  const videoId = extractYouTubeId(videoUrl)
  if (!videoId) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
  }

  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      moveId: moveId ?? null,
      moveName: moveName.trim(),
      videoUrl: videoUrl.trim(),
      videoId,
      note: note?.trim() ?? null,
    },
  })

  return NextResponse.json({ submission })
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ submissions })
}
