'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { VideoCard } from './VideoCard'
import { YouTubeVideo } from '@/lib/youtube'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SubmitMoveSection } from './SubmitMoveSection'

interface Move {
  id: string
  name: string
  slug: string
}

export function MoveDetailClient({ move }: { move: Move }) {
  const { data: session, status } = useSession()
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasApiKey = process.env.NEXT_PUBLIC_HAS_YT_KEY === 'true'

  const fetchVideos = useCallback(async () => {
    if (!session && !hasApiKey) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/youtube/search?move=${encodeURIComponent(move.name)}&moveId=${move.id}`)
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to load videos')
        return
      }
      const data = await res.json()
      setVideos(data.videos || [])
    } catch {
      setError('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }, [session, move.name, move.id, hasApiKey])

  useEffect(() => {
    if (session || hasApiKey) fetchVideos()
  }, [session, hasApiKey, fetchVideos])

  useEffect(() => {
    if (!session) return
    fetch(`/api/saved?moveId=${move.id}`)
      .then((r) => r.json())
      .then(({ saved }) => {
        setSavedIds(new Set((saved ?? []).map((s: { videoId: string }) => s.videoId)))
      })
  }, [session, move.id])

  return (
    <div>
      <div className="mb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          All moves
        </Link>
        <h1 className="text-2xl font-bold text-zinc-100">{move.name}</h1>
      </div>

      {status === 'unauthenticated' && !hasApiKey && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
          <Lock className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-200 font-medium mb-1">Sign in to watch tutorials</p>
          <p className="text-zinc-500 text-sm mb-5">
            Sign in to browse tutorials for this move.
          </p>
          <Button
            onClick={() => signIn('google', { callbackUrl: window.location.href })}
            className="bg-violet-700 hover:bg-violet-600 text-white"
          >
            Sign in
          </Button>
        </div>
      )}

      {(status === 'authenticated' || hasApiKey) && (
        <>
          {error && (
            <Alert className="mb-5 bg-red-950/40 border-red-900 text-red-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-b border-zinc-800 pb-6 last:border-0 last:pb-0">
                  <Skeleton className="w-full aspect-video rounded-lg bg-zinc-800 mb-3" />
                  <Skeleton className="h-4 w-3/4 bg-zinc-800 mb-2" />
                  <Skeleton className="h-3 w-1/3 bg-zinc-800" />
                </div>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="space-y-6">
              {videos.map((video) => (
                <VideoCard key={video.videoId} video={video} moveId={move.id} moveName={move.name} initialSaved={savedIds.has(video.videoId)} />
              ))}
            </div>
          ) : (
            <p className="text-center py-16 text-zinc-500 text-sm">No videos found.</p>
          )}
        </>
      )}

      <SubmitMoveSection moveName={move.name} moveId={move.id} />
    </div>
  )
}
