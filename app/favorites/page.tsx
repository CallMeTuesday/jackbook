'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SavedVideosList } from '@/components/SavedVideosList'

interface SavedVideo {
  id: string
  videoId: string
  videoTitle: string
  videoThumb: string
  channelTitle: string
  moveId: string
  moveName: string
}

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [groups, setGroups] = useState<{ moveName: string; moveId: string; videos: SavedVideo[] }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/')
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch('/api/saved')
      .then((r) => r.json())
      .then(({ saved }) => {
        const byMove: Record<string, { moveName: string; moveId: string; videos: SavedVideo[] }> = {}
        for (const v of saved ?? []) {
          if (!byMove[v.moveId]) byMove[v.moveId] = { moveName: v.moveName, moveId: v.moveId, videos: [] }
          byMove[v.moveId].videos.push(v)
        }
        setGroups(Object.values(byMove))
        setLoading(false)
      })
  }, [session])

  if (status === 'loading' || !session) return null

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm mb-4">
          <ArrowLeft className="h-4 w-4" />
          All moves
        </Link>
        <h1 className="text-xl font-bold text-zinc-100">Favorites</h1>
      </div>

      {loading ? (
        <p className="text-zinc-600 text-sm">Loading…</p>
      ) : groups.length === 0 ? (
        <p className="text-zinc-600 text-sm">No saved videos yet. Bookmark videos from any move page.</p>
      ) : (
        <SavedVideosList groups={groups} />
      )}
    </main>
  )
}
