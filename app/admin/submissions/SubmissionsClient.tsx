'use client'

import { useState } from 'react'

interface Submission {
  id: string
  videoId: string
  videoUrl: string
  moveName: string
  moveSlug: string | null
  submitterName: string
  note: string | null
  createdAt: string
  videoTitle: string | null
  channelTitle: string | null
}

export function SubmissionsClient({ submissions: initial }: { submissions: Submission[] }) {
  const [submissions, setSubmissions] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)

  async function handleAction(id: string, status: 'approved' | 'rejected') {
    setLoading(id)
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(null)
    if (res.ok) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id))
    }
  }

  return (
    <ul className="space-y-8">
      {submissions.map((s) => (
        <li key={s.id} className="border border-zinc-800 rounded-lg overflow-hidden">
          <div className="aspect-video w-full bg-zinc-900">
            <iframe
              src={`https://www.youtube.com/embed/${s.videoId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="font-medium text-zinc-100">
                {s.videoTitle ?? s.videoUrl}
              </p>
              {s.channelTitle && (
                <p className="text-sm text-zinc-400">{s.channelTitle}</p>
              )}
            </div>
            <div className="text-sm text-zinc-400 space-y-1">
              <p>
                <span className="text-zinc-500">Move: </span>
                {s.moveSlug ? (
                  <a href={`/moves/${s.moveSlug}`} className="text-zinc-200 hover:underline">
                    {s.moveName}
                  </a>
                ) : (
                  <span className="text-zinc-200">{s.moveName}</span>
                )}
              </p>
              <p>
                <span className="text-zinc-500">Submitted by: </span>
                <span className="text-zinc-200">{s.submitterName}</span>
              </p>
              {s.note && (
                <p>
                  <span className="text-zinc-500">Note: </span>
                  <span className="text-zinc-200">{s.note}</span>
                </p>
              )}
              <p className="text-zinc-600 text-xs">
                {new Date(s.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => handleAction(s.id, 'approved')}
                disabled={loading === s.id}
                className="px-4 py-1.5 rounded bg-violet-700 hover:bg-violet-600 text-sm font-medium disabled:opacity-50 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(s.id, 'rejected')}
                disabled={loading === s.id}
                className="px-4 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-sm font-medium disabled:opacity-50 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
