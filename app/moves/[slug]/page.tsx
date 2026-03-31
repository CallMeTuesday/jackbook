import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { MoveDetailClient } from '@/components/MoveDetailClient'

interface Props {
  params: { slug: string }
}

export default async function MovePage({ params }: Props) {
  const move = await prisma.move.findUnique({
    where: { slug: params.slug },
    select: { id: true, name: true, slug: true, style: true },
  })

  if (!move) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <MoveDetailClient move={move} />
    </main>
  )
}
