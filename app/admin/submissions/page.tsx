import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getVideosByIds } from '@/lib/youtube'
import { SubmissionsClient } from './SubmissionsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSubmissionsPage() {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    return <div className="p-8 text-zinc-400">ADMIN_EMAIL env var not set.</div>
  }

  const session = await auth()
  if (!session?.user?.email || session.user.email !== adminEmail) {
    redirect('/')
  }

  const submissions = await prisma.submission.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: { name: true, email: true } },
      move: { select: { name: true, slug: true } },
    },
  })

  const apiKey = process.env.YOUTUBE_API_KEY
  let videoDetails: Record<string, { title: string; channelTitle: string; thumbnail: string }> = {}
  if (apiKey && submissions.length > 0) {
    const ids = submissions.map((s) => s.videoId)
    videoDetails = await getVideosByIds(ids, { apiKey })
  }

  const enriched = submissions.map((s) => ({
    id: s.id,
    videoId: s.videoId,
    videoUrl: s.videoUrl,
    moveName: s.moveName,
    moveSlug: s.move?.slug ?? null,
    submitterName: s.user?.name ?? s.user?.email ?? 'Unknown',
    note: s.note,
    createdAt: s.createdAt.toISOString(),
    videoTitle: videoDetails[s.videoId]?.title ?? null,
    channelTitle: videoDetails[s.videoId]?.channelTitle ?? null,
  }))

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mb-6">Pending Submissions</h1>
      {enriched.length === 0 ? (
        <p className="text-zinc-500">No pending submissions.</p>
      ) : (
        <SubmissionsClient submissions={enriched} />
      )}
    </main>
  )
}
