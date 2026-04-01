import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, pronouns, bio, image, username } = body

  const data: Record<string, unknown> = {}

  if (name !== undefined) data.name = String(name).trim().slice(0, 60) || null
  if (pronouns !== undefined) data.pronouns = String(pronouns).trim().slice(0, 40) || null
  if (bio !== undefined) data.bio = String(bio).trim().slice(0, 200) || null
  if (image !== undefined) data.image = String(image).trim() || null

  if (username !== undefined) {
    const clean = String(username).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
    if (clean.length < 3 || clean.length > 30) {
      return NextResponse.json({ error: 'Username must be 3–30 characters' }, { status: 400 })
    }
    const taken = await prisma.user.findUnique({ where: { username: clean } })
    if (taken && taken.id !== session.user.id) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
    }
    data.username = clean
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { name: true, pronouns: true, bio: true, image: true, username: true },
  })

  return NextResponse.json({ user })
}
