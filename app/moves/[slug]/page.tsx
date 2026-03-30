import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { MoveDetailClient } from '@/components/MoveDetailClient'
import { Navbar } from '@/components/Navbar'

interface Props {
  params: { slug: string }
}


export default async function MovePage({ params }: Props) {
  const move = await prisma.move.findUnique({
    where: { slug: params.slug },
  })

  if (!move) {
    notFound()
  }

  return (
    <>
      <Suspense><Navbar /></Suspense>
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <MoveDetailClient move={move} />
      </main>
    </>
  )
}
