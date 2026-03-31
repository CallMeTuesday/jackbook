'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SavedVideosList } from '@/components/SavedVideosList'

const STYLE_LABELS: Record<string, string> = {
  house: 'House',
  hiphop: 'Hip-hop',
  locking: 'Locking',
  popping: 'Popping',
  breaking: 'Breaking',
  waacking: 'Waacking',
  vogue: 'Vogue',
}

interface SavedVideo {
  id: string
  videoId: string
  videoTitle: string
  videoThumb: string
  channelTitle: string
  moveId: string
  moveName: string
  moveStyle: string
}

interface Group {
  moveName: string
  moveId: string
  moveStyle: string
  videos: SavedVideo[]
}

export function FavoritesClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStyle, setActiveStyle] = useState<string | null>(searchParams.get('style'))

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/')
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch('/api/saved')
      .then((r) => r.json())
      .then(({ saved }) => {
        const byMove: Record<string, Group> = {}
        for (const v of saved ?? []) {
          if (!byMove[v.moveId]) {
            byMove[v.moveId] = { moveName: v.moveName, moveId: v.moveId, moveStyle: v.moveStyle ?? 'house', videos: [] }
          }
          byMove[v.moveId].videos.push(v)
        }
        setGroups(Object.values(byMove))
        setLoading(false)
      })
  }, [session])

  // When groups change, reset active style if that category no longer has videos
  useEffect(() => {
    if (activeStyle && !groups.some((g) => g.moveStyle === activeStyle)) {
      setActiveStyle(null)
      window.history.replaceState(null, '', '/favorites')
    }
  }, [groups, activeStyle])

  // Sync active style from browser history navigation
  useEffect(() => {
    function onPopState() {
      const params = new URLSearchParams(window.location.search)
      setActiveStyle(params.get('style'))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  if (status === 'loading' || !session) return null

  const presentStyles = [...new Set(groups.map((g) => g.moveStyle))]
    .filter((s) => s in STYLE_LABELS)
    .sort((a, b) => STYLE_LABELS[a].localeCompare(STYLE_LABELS[b]))
  const visibleGroups = activeStyle ? groups.filter((g) => g.moveStyle === activeStyle) : groups

  function toggleStyle(style: string) {
    const next = activeStyle === style ? null : style
    setActiveStyle(next)
    const url = next ? `/favorites?style=${next}` : '/favorites'
    window.history.pushState(null, '', url)
  }

  function handleVideoRemoved(moveId: string, videoId: string) {
    setGroups((prev) =>
      prev
        .map((g) =>
          g.moveId === moveId
            ? { ...g, videos: g.videos.filter((v) => v.videoId !== videoId) }
            : g
        )
        .filter((g) => g.videos.length > 0)
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-100">Favorites</h1>
      </div>

      {loading ? (
        <p className="text-zinc-600 text-sm">Loading…</p>
      ) : groups.length === 0 ? (
        <p className="text-zinc-600 text-sm">No saved videos yet. Bookmark videos from any move page.</p>
      ) : (
        <>
          {presentStyles.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {presentStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeStyle === style
                      ? 'bg-violet-700 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {STYLE_LABELS[style] ?? style}
                </button>
              ))}
            </div>
          )}
          <SavedVideosList
            key={activeStyle ?? 'all'}
            groups={visibleGroups}
            onRemove={handleVideoRemoved}
          />
        </>
      )}
    </main>
  )
}
