import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { searchMoveVideos, searchFreeQuery } from '@/lib/youtube'
import { prisma } from '@/lib/db'

// Cache TTL: 7 days. Results for a given move rarely change.
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000

function getYtAuth() {
  const apiKey = process.env.YOUTUBE_API_KEY
  return apiKey ? { apiKey } : null
}

async function getOAuthAuth() {
  const session = await auth()
  const accessToken = (session as any)?.accessToken
  if (!session?.user || !accessToken) return null
  return { accessToken }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const move = searchParams.get('move')
    const q = searchParams.get('q')
    const moveId = searchParams.get('moveId')

    if (!move && !q) {
      return NextResponse.json({ error: 'move or q parameter required' }, { status: 400 })
    }

    // --- Cache check (move-specific searches only) ---
    if (move && moveId) {
      const cached = await prisma.videoCache.findUnique({ where: { moveId } })
      if (cached) {
        const age = Date.now() - cached.fetchedAt.getTime()
        if (age < CACHE_TTL_MS) {
          return NextResponse.json({ videos: JSON.parse(cached.videos), cached: true })
        }
      }
    }

    // --- Need to fetch from YouTube ---
    const ytAuth = getYtAuth() ?? await getOAuthAuth()

    if (!ytAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = move
      ? await searchMoveVideos(move, ytAuth)
      : await searchFreeQuery(q!, ytAuth)

    if (result.error) {
      // If quota exceeded but we have a stale cache, serve it rather than erroring
      if (move && moveId) {
        const stale = await prisma.videoCache.findUnique({ where: { moveId } })
        if (stale) {
          return NextResponse.json({ videos: JSON.parse(stale.videos), cached: true, stale: true })
        }
      }
      return NextResponse.json({ error: result.error }, { status: 503 })
    }

    // --- Populate/update cache (fire-and-forget) ---
    if (move && moveId && result.videos.length > 0) {
      const videosJson = JSON.stringify(result.videos)

      prisma.videoCache.upsert({
        where: { moveId },
        update: { videos: videosJson, fetchedAt: new Date() },
        create: { moveId, videos: videosJson },
      }).catch((e) => console.error('Cache write failed:', e))
    }

    return NextResponse.json(result)
  } catch (e) {
    console.error('YouTube search route error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
