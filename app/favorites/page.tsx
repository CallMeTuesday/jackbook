import { Suspense } from 'react'
import { FavoritesClient } from './FavoritesClient'

export default function FavoritesPage() {
  return (
    <Suspense>
      <FavoritesClient />
    </Suspense>
  )
}
