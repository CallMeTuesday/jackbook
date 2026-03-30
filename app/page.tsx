import { prisma } from '@/lib/db'
import { HomeClient } from '@/components/HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const moves = await prisma.move.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true, featured: true, thumbnail: true },
  })

  return <HomeClient moves={moves} />
}
