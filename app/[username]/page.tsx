import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { ProfileClient } from './ProfileClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: { username: string }
}

export default async function ProfilePage({ params }: Props) {
  const [user, session] = await Promise.all([
    prisma.user.findUnique({
      where: { username: params.username },
      include: {
        submissions: {
          where: { status: 'approved' },
          orderBy: { createdAt: 'desc' },
          select: { id: true, videoId: true, moveName: true, moveId: true, isPremium: true },
        },
        savedVideos: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { followers: true, following: true },
        },
      },
    }),
    auth(),
  ])

  if (!user) notFound()

  const isOwn = session?.user?.id === user.id

  if (!user.profilePublic && !isOwn) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-zinc-500 text-sm">This profile is private.</p>
      </main>
    )
  }

  let isFollowing = false
  if (session?.user?.id && !isOwn) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: user.id,
        },
      },
    })
    isFollowing = !!follow
  }

  const freeVideos = user.submissions.filter((s) => !s.isPremium)
  const premiumVideos = user.submissions.filter((s) => s.isPremium)

  const savedByMove: Record<string, { moveName: string; moveId: string; videos: typeof user.savedVideos }> = {}
  for (const v of user.savedVideos) {
    if (!savedByMove[v.moveId]) {
      savedByMove[v.moveId] = { moveName: v.moveName, moveId: v.moveId, videos: [] }
    }
    savedByMove[v.moveId].videos.push(v)
  }

  return (
    <ProfileClient
      profile={{
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        pronouns: user.pronouns ?? null,
        bio: user.bio ?? null,
        videoCount: user.submissions.length,
        followerCount: user._count.followers,
        followingCount: user._count.following,
        isFollowing,
        isOwn,
      }}
      freeVideos={freeVideos}
      premiumVideos={premiumVideos}
      savedGroups={Object.values(savedByMove)}
    />
  )
}
