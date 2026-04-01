import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: { username: string } }
) {
  const [user, session] = await Promise.all([
    prisma.user.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        pronouns: true,
        bio: true,
        profilePublic: true,
        _count: {
          select: {
            followers: true,
            following: true,
            submissions: { where: { status: 'approved' } },
          },
        },
      },
    }),
    auth(),
  ])

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isOwn = session?.user?.id === user.id
  if (!user.profilePublic && !isOwn) {
    return NextResponse.json({ error: 'Private' }, { status: 403 })
  }

  let isFollowing = false
  if (session?.user?.id && !isOwn) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: session.user.id, followingId: user.id } },
    })
    isFollowing = !!follow
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
      pronouns: user.pronouns,
      bio: user.bio,
      videoCount: user._count.submissions,
      followerCount: user._count.followers,
      followingCount: user._count.following,
      isFollowing,
      isOwn,
    },
  })
}
