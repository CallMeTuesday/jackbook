import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Navbar } from '@/components/Navbar'

interface Props {
  params: { username: string }
}

export default async function ProfilePage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      submissions: {
        where: { status: 'approved' },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!user) notFound()

  if (!user.profilePublic) {
    return (
      <>
        <Suspense><Navbar /></Suspense>
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-zinc-500 text-sm">This profile is private.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Suspense><Navbar /></Suspense>
      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          {user.image ? (
            <Image src={user.image} alt={user.name ?? ''} width={56} height={56} className="rounded-full" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-violet-700 flex items-center justify-center text-white text-xl font-bold">
              {user.name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-zinc-100">{user.name}</h1>
            <p className="text-sm text-zinc-500">@{user.username}</p>
          </div>
        </div>

        {/* Submissions */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Submitted tutorials</h2>
          {user.submissions.length === 0 ? (
            <p className="text-zinc-600 text-sm">No approved tutorials yet.</p>
          ) : (
            <div className="space-y-4">
              {user.submissions.map((s) => (
                <div key={s.id} className="border border-zinc-800 rounded-lg overflow-hidden">
                  <a
                    href={`https://www.youtube.com/watch?v=${s.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative aspect-video bg-zinc-900"
                  >
                    <Image
                      src={`https://i.ytimg.com/vi/${s.videoId}/mqdefault.jpg`}
                      alt={s.moveName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 672px"
                    />
                  </a>
                  <div className="px-3 py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{s.moveName}</p>
                      {s.moveId && (
                        <Link href={`/moves/${s.moveId}`} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                          View move →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
