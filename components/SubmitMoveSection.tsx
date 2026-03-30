'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

interface Props {
  moveName: string
  moveId: string
}

export function SubmitMoveSection({ moveName, moveId }: Props) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moveName, moveId, videoUrl, note }),
    })

    const data = await res.json()
    setSubmitting(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      return
    }

    setSubmitted(true)
  }

  if (!session) return null

  return (
    <div className="mt-10 border-t border-zinc-800 pt-8">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-4"
        >
          Not seeing the right tutorial? Submit one
        </button>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-200">Submit a tutorial for <span className="text-violet-400">{moveName}</span></p>
            <button onClick={() => setOpen(false)} className="text-zinc-600 hover:text-zinc-400 text-xs">
              Cancel
            </button>
          </div>

          {/* Instructions accordion */}
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
            <button
              onClick={() => setInstructionsOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900/60 transition-colors"
            >
              <span>How to film a great house dance tutorial</span>
              {instructionsOpen ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
            </button>

            {instructionsOpen && (
              <div className="px-4 pb-4 pt-1 text-sm text-zinc-400 space-y-4 border-t border-zinc-800">
                <div className="space-y-1.5">
                  <p className="text-zinc-300 font-medium">Before you film</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Find a clean background with good lighting — face a window if you can</li>
                    <li>Wear the shoes you actually dance in</li>
                    <li>Clear enough space to show your full body</li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <p className="text-zinc-300 font-medium">What to include</p>
                  <ol className="space-y-1 list-decimal list-inside">
                    <li>Slow demonstration from the front (2–3×)</li>
                    <li>Slow demonstration from the side (1–2×)</li>
                    <li>Normal speed with music</li>
                    <li>Optional: break down the weight shifts or footwork</li>
                  </ol>
                </div>

                <div className="space-y-1.5">
                  <p className="text-zinc-300 font-medium">Tips</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Keep it under 5 minutes</li>
                    <li>You don't need to talk — just show the move</li>
                    <li>Film vertically (9:16) for best mobile viewing</li>
                  </ul>
                </div>

                <a
                  href="https://www.youtube.com/upload"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors font-medium"
                >
                  Upload to YouTube <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Submission form */}
          {submitted ? (
            <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-5 text-center">
              <p className="text-zinc-200 font-medium mb-1">Submitted — thank you!</p>
              <p className="text-zinc-500 text-sm">Your tutorial will appear after review.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">YouTube URL</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  className="w-full h-9 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1">Note <span className="text-zinc-700">(optional)</span></label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Anything you want reviewers to know"
                  className="w-full h-9 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting || !videoUrl.trim()}
                className="w-full h-9 rounded-md bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {submitting ? 'Submitting…' : 'Submit for review'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
