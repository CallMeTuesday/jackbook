import Link from 'next/link'
import Image from 'next/image'
import { Lock } from 'lucide-react'

interface Props {
  videoId: string
  moveName: string
  moveSlug: string | null
  isPremium?: boolean
  locked?: boolean
}

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function VideoGridCard({ videoId, moveName, moveSlug, isPremium, locked }: Props) {
  const slug = moveSlug ?? nameToSlug(moveName)
  const thumb = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`

  return (
    <Link href={`/moves/${slug}`} className="group block">
      <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden">
        <Image
          src={thumb}
          alt={moveName}
          fill
          className={`object-cover transition-opacity group-hover:opacity-80 ${locked ? 'blur-sm' : ''}`}
          sizes="(max-width: 640px) 50vw, 33vw"
        />
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="flex flex-col items-center gap-1">
              <Lock className="h-5 w-5 text-white" />
              <span className="text-xs text-white font-medium">Subscribe</span>
            </div>
          </div>
        )}
        {isPremium && !locked && (
          <div className="absolute top-1.5 right-1.5 bg-black/60 rounded px-1.5 py-0.5">
            <Lock className="h-3 w-3 text-violet-400 inline" />
          </div>
        )}
      </div>
      <p className="mt-1.5 text-xs text-zinc-400 truncate group-hover:text-zinc-200 transition-colors">
        {moveName}
      </p>
    </Link>
  )
}
