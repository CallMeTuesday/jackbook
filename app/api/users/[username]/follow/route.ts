import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function getTarget(username: string) {
  return prisma.user.findUnique({ where: { username }, select: { id: true } })
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { username: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const target = await getTarget(params.username)
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (target.id === session.user.id) return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: session.user.id, followingId: target.id } },
    update: {},
    create: { followerId: session.user.id, followingId: target.id },
  })

  const followerCount = await prisma.follow.count({ where: { followingId: target.id } })
  return NextResponse.json({ isFollowing: true, followerCount })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { username: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const target = await getTarget(params.username)
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.follow.deleteMany({
    where: { followerId: session.user.id, followingId: target.id },
  })

  const followerCount = await prisma.follow.count({ where: { followingId: target.id } })
  return NextResponse.json({ isFollowing: false, followerCount })
}
