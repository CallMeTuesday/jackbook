'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { YouTubeVideo } from '@/lib/youtube'

interface VideoCardProps {
  video: YouTubeVideo
}

export function VideoCard({ video }: VideoCardProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="border-b border-zinc-800 last:border-0 pb-6 last:pb-0">
      <div className="relative w-full aspect-video bg-zinc-900 rounded-lg overflow-hidden mb-3">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
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
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 512px"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
              <div className="bg-black/60 rounded-full p-3 group-hover:scale-110 transition-transform">
                <Play className="h-7 w-7 text-white fill-white" />
              </div>
            </div>
          </button>
        )}
      </div>

      <div className="px-1">
        <p className="text-sm font-medium text-zinc-100 leading-snug line-clamp-2">{video.title}</p>
        <p className="text-xs text-zinc-500 mt-0.5 truncate">{video.channelTitle}</p>
      </div>
    </div>
  )
}
