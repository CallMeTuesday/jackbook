import Link from 'next/link'
import Image from 'next/image'
import { getMoveGradient } from '@/lib/moveColor'

interface MoveCardProps {
  name: string
  slug: string
  featured?: boolean
  thumbnail?: string | null
}

export function MoveCard({ name, slug, thumbnail }: MoveCardProps) {
  const { from, to } = getMoveGradient(name)

  return (
    <Link
      href={`/moves/${slug}`}
      className="group block rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-200"
    >
      <div
        className="relative w-full aspect-video flex items-end p-3"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {/* Custom image — fills behind gradient overlay when set */}
        {thumbnail && (
          <>
            <Image
              src={thumbnail}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            {/* Gradient overlay so text always readable */}
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${from}cc, ${to}99)` }}
            />
          </>
        )}

        {/* Move name — Spotify-style, bottom-left */}
        <p
          className="relative z-10 font-bold text-white leading-tight drop-shadow-md"
          style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}
        >
          {name}
        </p>
      </div>
    </Link>
  )
}
