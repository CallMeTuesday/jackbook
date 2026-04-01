'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Play, Bookmark, Trash2 } from 'lucide-react'
import { YouTubeVideo } from '@/lib/youtube'
import { useSession } from 'next-auth/react'

interface VideoCardProps {
  video: YouTubeVideo
  moveId?: string
  moveName?: string
  initialSaved?: boolean
  onRemove?: (videoId: string) => void
}

export function VideoCard({ video, moveId, moveName, initialSaved = false, onRemove }: VideoCardProps) {
  const { data: session } = useSession()
  const [playing, setPlaying] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [saved, setSaved] = useState(initialSaved)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setSaved(initialSaved) }, [initialSaved])
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  async function toggleSave() {
    if (!session || !moveId || !moveName) return
    setSaving(true)
    const res = await fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moveId,
        moveName,
        videoId: video.videoId,
        videoTitle: video.title,
        videoThumb: video.thumbnail,
        channelTitle: video.channelTitle,
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) setSaved(data.saved)
  }

  const showSaveButton = !!session && !!moveId && !onRemove

  return (
    <div className="border-b border-zinc-800 last:border-0 pb-6 last:pb-0">
      <div className="relative w-full aspect-video bg-zinc-900 rounded-lg overflow-hidden mb-3">
        {isMobile ? (
          // Mobile: render iframe directly — iOS blocks autoplay so our overlay
          // just adds an extra tap. YouTube's native play button is the one tap needed.
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            className="absolute inset-0 w-full h-full group"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${video.title}`}
          >
            <Image src={video.thumbnail} alt={video.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 512px" />
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
          <p className="text-sm font-medium text-zinc-100 leading-snug line-clamp-2">{video.title}</p>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{video.channelTitle}</p>
        </div>

        {showSaveButton && (
          <button
            onClick={toggleSave}
            disabled={saving}
            aria-label={saved ? 'Unsave' : 'Save'}
            className={`flex-shrink-0 transition-colors disabled:opacity-50 mt-0.5 ${saved ? 'text-violet-400' : 'text-zinc-600 hover:text-zinc-300'}`}
          >
            <Bookmark className={`h-5 w-5 ${saved ? 'fill-violet-400' : ''}`} />
          </button>
        )}

        {onRemove && (
          <button
            onClick={() => onRemove(video.videoId)}
            aria-label="Remove saved video"
            className="flex-shrink-0 text-zinc-600 hover:text-red-400 transition-colors mt-0.5"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
