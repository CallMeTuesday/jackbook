'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, Play } from 'lucide-react'
import { YouTubeVideo } from '@/lib/youtube'
import { useSession } from 'next-auth/react'
import { LoginDialog } from './LoginDialog'

interface VideoCardProps {
  video: YouTubeVideo
  moveId: string
  voteCount: number
  hasVoted: boolean
  isCommunityPick: boolean
  onVote: (videoId: string, videoTitle: string) => void
}

export function VideoCard({
  video,
  moveId,
  voteCount,
  hasVoted,
  isCommunityPick,
  onVote,
}: VideoCardProps) {
  const { data: session } = useSession()
  const [playing, setPlaying] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [callbackUrl, setCallbackUrl] = useState('/')

  useEffect(() => {
    setCallbackUrl(window.location.href)
  }, [])

  // After sign-in, retry the pending vote
  const [pendingVote, setPendingVote] = useState(false)
  useEffect(() => {
    if (session && pendingVote) {
      setPendingVote(false)
      onVote(video.videoId, video.title)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, pendingVote])

  const handleVote = async () => {
    if (!session) {
      setPendingVote(true)
      setShowLogin(true)
      return
    }
    setIsVoting(true)
    await onVote(video.videoId, video.title)
    setIsVoting(false)
  }

  return (
    <>
      <div className="border-b border-zinc-800 last:border-0 pb-6 last:pb-0">
        {/* Thumbnail / Player */}
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
            <>
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
              {isCommunityPick && (
                <Badge className="absolute top-2 left-2 bg-violet-600 text-white text-xs border-0 shadow-lg">
                  ★ Community Pick
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Meta + Vote */}
        <div className="flex items-start justify-between gap-3 px-1">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-100 leading-snug line-clamp-2">
              {video.title}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5 truncate">{video.channelTitle}</p>
          </div>

          <button
            onClick={handleVote}
            disabled={isVoting}
            className={`flex-shrink-0 flex flex-col items-center gap-0.5 transition-colors disabled:opacity-50 ${
              hasVoted ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            aria-label={hasVoted ? 'Remove vote' : 'Vote for this video'}
          >
            <ThumbsUp className={`h-5 w-5 ${hasVoted ? 'fill-violet-400' : ''}`} />
            {voteCount > 0 && (
              <span className="text-xs font-medium">{voteCount}</span>
            )}
          </button>
        </div>
      </div>

      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        callbackUrl={callbackUrl}
      />
    </>
  )
}
