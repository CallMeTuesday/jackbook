'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LayoutGrid, Lock, Bookmark } from 'lucide-react'
import { FollowButton } from '@/components/FollowButton'
import { EditProfileModal } from '@/components/EditProfileModal'
import { VideoGridCard } from '@/components/VideoGridCard'
import { SavedVideosList } from '@/components/SavedVideosList'

interface Submission {
  id: string
  videoId: string
  moveName: string
  moveId: string | null
  isPremium: boolean
}

interface SavedGroup {
  moveName: string
  moveId: string
  moveStyle?: string
  videos: {
    id: string
    videoId: string
    videoTitle: string
    videoThumb: string
    channelTitle: string
    moveId: string
    moveName: string
  }[]
}

interface ProfileData {
  id: string
  name: string | null
  username: string | null
  image: string | null
  pronouns: string | null
  bio: string | null
  videoCount: number
  followerCount: number
  followingCount: number
  isFollowing: boolean
  isOwn: boolean
}

interface Props {
  profile: ProfileData
  freeVideos: Submission[]
  premiumVideos: Submission[]
  savedGroups: SavedGroup[]
}

type Tab = 'videos' | 'premium' | 'favorites'

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function ProfileClient({ profile: initial, freeVideos, premiumVideos, savedGroups }: Props) {
  const [profile, setProfile] = useState(initial)
  const [followerCount, setFollowerCount] = useState(initial.followerCount)
  const [tab, setTab] = useState<Tab>('videos')
  const [editOpen, setEditOpen] = useState(false)

  const isCreator = profile.videoCount > 0
  const showPremiumTab = premiumVideos.length > 0

  const tabs: { key: Tab; icon: React.ReactNode; label: string }[] = [
    { key: 'videos', icon: <LayoutGrid className="h-4 w-4" />, label: 'Videos' },
    ...(showPremiumTab ? [{ key: 'premium' as Tab, icon: <Lock className="h-4 w-4" />, label: 'Premium' }] : []),
    { key: 'favorites', icon: <Bookmark className="h-4 w-4" />, label: 'Favorites' },
  ]

  function handleProfileSave(updated: { name: string | null; username: string | null; pronouns: string | null; bio: string | null; image: string | null }) {
    setProfile((p) => ({ ...p, ...updated }))
  }

  const initials = profile.name?.[0]?.toUpperCase() ?? '?'

  return (
    <>
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden bg-violet-800 flex items-center justify-center text-white text-2xl font-bold relative">
              {profile.image ? (
                <Image src={profile.image} alt={profile.name ?? ''} fill className="object-cover" sizes="80px" />
              ) : (
                initials
              )}
            </div>

            {/* Identity + action */}
            <div className="flex-1 min-w-0 space-y-2 pt-1">
              <div>
                <h1 className="text-lg font-bold text-zinc-100 leading-tight">{profile.name ?? profile.username}</h1>
                <p className="text-sm text-zinc-500">@{profile.username}</p>
                {profile.pronouns && (
                  <p className="text-xs text-zinc-600 mt-0.5">{profile.pronouns}</p>
                )}
              </div>

              {profile.isOwn ? (
                <button
                  onClick={() => setEditOpen(true)}
                  className="px-4 py-1.5 rounded-full border border-zinc-600 text-zinc-300 hover:border-zinc-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <FollowButton
                  username={profile.username!}
                  initialFollowing={profile.isFollowing}
                  initialCount={followerCount}
                  onCountChange={setFollowerCount}
                />
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <span className="font-semibold text-zinc-100">{profile.videoCount}</span>
              <span className="text-zinc-500 ml-1">videos</span>
            </div>
            <div className="text-center">
              <span className="font-semibold text-zinc-100">{followerCount}</span>
              <span className="text-zinc-500 ml-1">followers</span>
            </div>
            <div className="text-center">
              <span className="font-semibold text-zinc-100">{profile.followingCount}</span>
              <span className="text-zinc-500 ml-1">following</span>
            </div>
          </div>
        </div>

        {/* Tabs or simple favorites */}
        {isCreator ? (
          <>
            {/* Tab bar — icon only */}
            <div className="flex border-b border-zinc-800">
              {tabs.map(({ key, icon, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  aria-label={label}
                  className={`flex-1 flex justify-center py-3 transition-colors ${
                    tab === key
                      ? 'text-zinc-100 border-b-2 border-zinc-100 -mb-px'
                      : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>

            {tab === 'videos' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {freeVideos.length === 0 ? (
                  <p className="text-zinc-600 text-sm col-span-full py-8 text-center">No videos yet.</p>
                ) : freeVideos.map((s) => (
                  <VideoGridCard
                    key={s.id}
                    videoId={s.videoId}
                    moveName={s.moveName}
                    moveSlug={s.moveId ? nameToSlug(s.moveName) : null}
                  />
                ))}
              </div>
            )}

            {tab === 'premium' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {premiumVideos.map((s) => (
                  <VideoGridCard
                    key={s.id}
                    videoId={s.videoId}
                    moveName={s.moveName}
                    moveSlug={s.moveId ? nameToSlug(s.moveName) : null}
                    isPremium
                    locked={!profile.isOwn}
                  />
                ))}
                {!profile.isOwn && (
                  <div className="col-span-full mt-2 text-center">
                    <p className="text-sm text-zinc-500 mb-3">Subscribe to unlock premium content from {profile.name ?? profile.username}.</p>
                    <button
                      disabled
                      className="px-5 py-2 rounded-full bg-violet-700 text-white text-sm font-medium opacity-50 cursor-not-allowed"
                    >
                      Subscribe · Coming soon
                    </button>
                  </div>
                )}
              </div>
            )}

            {tab === 'favorites' && (
              savedGroups.length === 0 ? (
                <p className="text-zinc-600 text-sm py-8 text-center">No saved videos yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {savedGroups.flatMap((g) =>
                    g.videos.map((v) => (
                      <VideoGridCard
                        key={v.id}
                        videoId={v.videoId}
                        moveName={v.moveName}
                        moveSlug={nameToSlug(v.moveName)}
                      />
                    ))
                  )}
                </div>
              )
            )}
          </>
        ) : (
          /* Non-creator: just favorites */
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Favorites</h2>
            {savedGroups.length === 0 ? (
              <p className="text-zinc-600 text-sm">No saved videos yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {savedGroups.flatMap((g) =>
                  g.videos.map((v) => (
                    <VideoGridCard
                      key={v.id}
                      videoId={v.videoId}
                      moveName={v.moveName}
                      moveSlug={nameToSlug(v.moveName)}
                    />
                  ))
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {editOpen && (
        <EditProfileModal
          profile={{ name: profile.name, username: profile.username, pronouns: profile.pronouns, bio: profile.bio, image: profile.image }}
          onClose={() => setEditOpen(false)}
          onSave={handleProfileSave}
        />
      )}
    </>
  )
}
