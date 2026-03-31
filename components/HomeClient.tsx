'use client'

import { Suspense } from 'react'
import { MoveListClient } from './MoveListClient'

interface Move {
  id: string
  name: string
  slug: string
  style: string
  featured: boolean
  thumbnail?: string | null
}

export function HomeClient({ moves }: { moves: Move[] }) {
  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <Suspense>
        <MoveListClient moves={moves} />
      </Suspense>
    </main>
  )
}
