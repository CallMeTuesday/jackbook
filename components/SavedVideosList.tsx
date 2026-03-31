'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Play } from 'lucide-react'

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

interface SavedVideo {
  id: string
  videoId: string
  videoTitle: string
  videoThumb: string
  channelTitle: string
  moveId: string
  moveName: string
}

interface Group {
  moveName: string
  moveId: string
  moveStyle?: string
  videos: SavedVideo[]
}

interface Props {
  groups: Group[]
  onRemove?: (moveId: string, videoId: string) => void
}

export function SavedVideosList({ groups, onRemove }: Props) {
  const [items, setItems] = useState<Group[]>(groups)
  const [playing, setPlaying] = useState<string | null>(null)

  async function handleRemove(moveId: string, videoId: string) {
    const group = items.find((g) => g.moveId === moveId)
    const video = group?.videos.find((v) => v.videoId === videoId)
    if (!video) return

    const res = await fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moveId,
        moveName: group!.moveName,
        videoId,
        videoTitle: video.videoTitle,
        videoThumb: video.videoThumb,
        channelTitle: video.channelTitle,
      }),
    })

    if (!res.ok) return

    setItems((prev) =>
      prev
        .map((g) =>
          g.moveId === moveId
            ? { ...g, videos: g.videos.filter((v) => v.videoId !== videoId) }
            : g
        )
        .filter((g) => g.videos.length > 0)
    )

    onRemove?.(moveId, videoId)
  }

  if (items.length === 0) return null

  return (
    <section className="space-y-8">
      {items.map((group) => (
        <div key={group.moveId} className="space-y-4">
          <Link
            href={`/moves/${nameToSlug(group.moveName)}`}
            className="text-base font-semibold text-zinc-200 hover:text-white transition-colors"
          >
            {group.moveName}
          </Link>
          <div className="space-y-4">
            {group.videos.map((video) => (
              <div key={video.videoId} className="border-b border-zinc-800 last:border-0 pb-4 last:pb-0">
                <div className="relative w-full aspect-video bg-zinc-900 rounded-lg overflow-hidden mb-3">
                  {playing === `${group.moveId}-${video.videoId}` ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                      title={video.videoTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <button
                      className="absolute inset-0 w-full h-full group"
                      onClick={() => setPlaying(`${group.moveId}-${video.videoId}`)}
                      aria-label={`Play ${video.videoTitle}`}
                    >
                      <Image
                        src={video.videoThumb}
                        alt={video.videoTitle}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 672px"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <div className="bg-black/60 rounded-full p-3 group-hover:scale-110 transition-transform">
                          <Play className="h-7 w-7 text-white fill-white" />
                        </div>
                      </div>
                    </button>
                  )}
                </div>

                <div className="px-1 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-100 leading-snug line-clamp-2">{video.videoTitle}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{video.channelTitle}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(group.moveId, video.videoId)}
                    aria-label="Remove saved video"
                    className="flex-shrink-0 text-zinc-600 hover:text-red-400 transition-colors mt-0.5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
