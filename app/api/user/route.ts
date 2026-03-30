import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true, profilePublic: true, name: true, image: true },
  })

  return NextResponse.json({ user })
}

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { username, profilePublic } = body

  if (username !== undefined) {
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
    if (clean.length < 3 || clean.length > 30) {
      return NextResponse.json({ error: 'Username must be 3–30 characters (letters, numbers, _ -)' }, { status: 400 })
    }

    const taken = await prisma.user.findUnique({ where: { username: clean } })
    if (taken && taken.id !== session.user.id) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 409 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { username: clean },
    })

    return NextResponse.json({ username: clean })
  }

  if (profilePublic !== undefined) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { profilePublic: Boolean(profilePublic) },
    })
    return NextResponse.json({ profilePublic: Boolean(profilePublic) })
  }

  return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
}
