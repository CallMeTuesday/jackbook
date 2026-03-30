'use client'

import { useState, Suspense } from 'react'
import { Navbar } from './Navbar'
import { MoveListClient } from './MoveListClient'

interface Move {
  id: string
  name: string
  slug: string
  featured: boolean
  thumbnail?: string | null
}

export function HomeClient({ moves }: { moves: Move[] }) {
  const [search, setSearch] = useState('')

  return (
    <>
      <Suspense>
        <Navbar search={search} onSearchChange={setSearch} />
      </Suspense>
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Suspense>
          <MoveListClient moves={moves} externalSearch={search} />
        </Suspense>
      </main>
    </>
  )
}
