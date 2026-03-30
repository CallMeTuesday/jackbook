import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

function ytThumbnail(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
}

/** Recalculate community pick and update Move.thumbnail if it changed. */
async function syncCommunityPickThumbnail(moveId: string) {
  const votes = await prisma.vote.findMany({
    where: { moveId },
    select: { videoId: true },
  })

  if (votes.length === 0) {
    // No votes left — clear thumbnail so gradient shows
    await prisma.move.update({ where: { id: moveId }, data: { thumbnail: null } })
    return
  }

  // Tally
  const counts: Record<string, number> = {}
  for (const v of votes) {
    counts[v.videoId] = (counts[v.videoId] ?? 0) + 1
  }
  const topVideoId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]

  // Only write if the thumbnail would actually change
  const move = await prisma.move.findUnique({ where: { id: moveId }, select: { thumbnail: true } })
  const newThumb = ytThumbnail(topVideoId)
  if (move?.thumbnail !== newThumb) {
    await prisma.move.update({ where: { id: moveId }, data: { thumbnail: newThumb } })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const moveId = searchParams.get('moveId')

  if (!moveId) {
    return NextResponse.json({ error: 'moveId is required' }, { status: 400 })
  }

  const votes = await prisma.vote.findMany({
    where: { moveId },
    select: { videoId: true, videoTitle: true, userId: true },
  })

  const voteCounts: Record<string, { count: number; videoTitle: string }> = {}
  for (const vote of votes) {
    if (!voteCounts[vote.videoId]) {
      voteCounts[vote.videoId] = { count: 0, videoTitle: vote.videoTitle }
    }
    voteCounts[vote.videoId].count++
  }

  return NextResponse.json({ votes: voteCounts })
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { moveId, videoId, videoTitle } = body

  if (!moveId || !videoId || !videoTitle) {
    return NextResponse.json({ error: 'moveId, videoId, and videoTitle are required' }, { status: 400 })
  }

  try {
    const existingVote = await prisma.vote.findUnique({
      where: { moveId_videoId_userId: { moveId, videoId, userId: session.user.id } },
    })

    if (existingVote) {
      await prisma.vote.delete({ where: { id: existingVote.id } })
    } else {
      await prisma.vote.create({ data: { moveId, videoId, videoTitle, userId: session.user.id } })
    }

    // Update community pick thumbnail after every vote change (no API call — just a URL)
    await syncCommunityPickThumbnail(moveId)

    return NextResponse.json({ voted: !existingVote })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })
  }
}
