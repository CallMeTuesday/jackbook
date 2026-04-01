'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { getMoveGradient } from '@/lib/moveColor'
import { MoveCard } from './MoveCard'
import { VideoCard } from './VideoCard'
import { Button } from '@/components/ui/button'
import { ArrowUpAZ, ArrowDownAZ, Search, LayoutGrid, List, Layers } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { YouTubeVideo } from '@/lib/youtube'
import { FlashcardView } from './FlashcardView'

const STYLES = [
  { key: 'house', label: 'House' },
  { key: 'hiphop', label: 'Hip-hop' },
  { key: 'locking', label: 'Locking' },
  { key: 'popping', label: 'Popping' },
  { key: 'breaking', label: 'Breaking' },
  { key: 'waacking', label: 'Waacking' },
  { key: 'vogue', label: 'Vogue' },
]

function MoveListItem({ name, slug, thumbnail }: { name: string; slug: string; thumbnail?: string | null }) {
  const { from, to } = getMoveGradient(name)

  return (
    <Link
      href={`/moves/${slug}`}
      className="flex items-center gap-3 py-2 border-b border-zinc-800/60 hover:bg-zinc-900/30 transition-colors group"
    >
      <div
        className="relative w-16 h-9 flex-shrink-0 rounded-md overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {thumbnail && (
          <>
            <Image src={thumbnail} alt={name} fill className="object-cover" sizes="64px" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${from}cc, ${to}99)` }} />
          </>
        )}
      </div>
      <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
        {name}
      </span>
    </Link>
  )
}

interface Move {
  id: string
  name: string
  slug: string
  style: string
  featured: boolean
  thumbnail?: string | null
}

interface MoveListClientProps {
  moves: Move[]
}

export function MoveListClient({ moves }: MoveListClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sortAsc, setSortAsc] = useState(true)

  const activeStyle = searchParams.get('style') ?? 'house'
  const externalSearch = searchParams.get('q') ?? ''

  // On mobile with no explicit view param, default to flashcard view
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const rawView = searchParams.get('view')
  const viewMode = (
    rawView === 'list' ? 'list' :
    rawView === 'flash' ? 'flash' :
    rawView === 'grid' ? 'grid' :
    isMobile ? 'flash' : 'grid'
  ) as 'grid' | 'list' | 'flash'

  function setStyle(style: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (style === 'house') {
      params.delete('style')
    } else {
      params.set('style', style)
    }
    // Clear search when switching styles
    params.delete('q')
    router.push(params.toString() ? `/?${params.toString()}` : '/')
  }

  function setViewMode(mode: 'grid' | 'list' | 'flash') {
    const params = new URLSearchParams(searchParams.toString())
    if (mode === 'list') params.set('view', 'list')
    else if (mode === 'flash') params.set('view', 'flash')
    else params.delete('view')
    router.replace(`/?${params.toString()}`, { scroll: false })
  }

  const [ytVideos, setYtVideos] = useState<YouTubeVideo[]>([])
  const [ytLoading, setYtLoading] = useState(false)
  const [ytError, setYtError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasApiKey = process.env.NEXT_PUBLIC_HAS_YT_KEY === 'true'

  const filtered = useMemo(() => {
    const q = externalSearch.toLowerCase()
    const result = moves
      .filter((m) => m.style === activeStyle)
      .filter((m) => m.name.toLowerCase().includes(q))
    return [...result].sort((a, b) => {
      const cmp = a.name.localeCompare(b.name)
      return sortAsc ? cmp : -cmp
    })
  }, [moves, activeStyle, externalSearch, sortAsc])

  const noLocalResults = externalSearch.length > 0 && filtered.length === 0
  useEffect(() => {
    if (!noLocalResults || !hasApiKey) {
      setYtVideos([])
      setYtError(null)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setYtLoading(true)
      setYtError(null)
      try {
        const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(externalSearch)}`)
        if (!res.ok) {
          const data = await res.json()
          setYtError(data.error || 'Search failed')
        } else {
          const data = await res.json()
          setYtVideos(data.videos || [])
        }
      } catch {
        setYtError('Search failed')
      } finally {
        setYtLoading(false)
      }
    }, 600)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [externalSearch, noLocalResults, hasApiKey])

  // Style filter buttons
  const styleFilter = (
    <div className="flex flex-wrap gap-2 mb-5">
      {STYLES.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setStyle(key)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeStyle === key
              ? 'bg-violet-700 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )

  // Local move list
  if (!noLocalResults) {
    return (
      <div>
        {styleFilter}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-zinc-600">
            {filtered.length} {filtered.length === 1 ? 'move' : 'moves'}
            {externalSearch && ` for "${externalSearch}"`}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortAsc((v) => !v)}
              className="text-zinc-500 hover:text-zinc-200 gap-1 h-7 px-2"
            >
              {sortAsc ? <ArrowUpAZ className="h-3.5 w-3.5" /> : <ArrowDownAZ className="h-3.5 w-3.5" />}
              <span className="text-xs">{sortAsc ? 'A–Z' : 'Z–A'}</span>
            </Button>
            <div className="w-px h-4 bg-zinc-800 mx-1" />
            <button
              onClick={() => setViewMode('flash')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'flash' ? 'text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'}`}
              title="Flashcard view"
            >
              <Layers className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'}`}
              title="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'}`}
              title="List view"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {viewMode === 'flash' ? (
          <FlashcardView moves={filtered} />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((move) => (
              <MoveCard
                key={move.id}
                name={move.name}
                slug={move.slug}
                featured={move.featured}
                thumbnail={move.thumbnail}
              />
            ))}
          </div>
        ) : (
          <div>
            {filtered.map((move) => (
              <MoveListItem key={move.id} name={move.name} slug={move.slug} thumbnail={move.thumbnail} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // YouTube search results
  return (
    <div>
      {styleFilter}
      <div className="flex items-center gap-2 mb-5 text-zinc-400">
        <Search className="h-4 w-4 flex-shrink-0" />
        <p className="text-sm">
          YouTube results for <span className="text-zinc-200 font-medium">&ldquo;{externalSearch}&rdquo;</span>
        </p>
      </div>

      {ytLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-b border-zinc-800 pb-6">
              <Skeleton className="w-full aspect-video rounded-lg bg-zinc-800 mb-3" />
              <Skeleton className="h-4 w-3/4 bg-zinc-800 mb-2" />
              <Skeleton className="h-3 w-1/3 bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : ytError ? (
        <p className="text-red-400 text-sm py-8 text-center">{ytError}</p>
      ) : ytVideos.length > 0 ? (
        <div className="space-y-6">
          {ytVideos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-500 text-sm text-center py-12">No results found.</p>
      )}
    </div>
  )
}
