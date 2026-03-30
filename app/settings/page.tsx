'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [savedUsername, setSavedUsername] = useState<string | null>(null)
  const [profilePublic, setProfilePublic] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null)
  const [submissions, setSubmissions] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/')
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch('/api/user').then((r) => r.json()).then(({ user }) => {
      if (user?.username) {
        setSavedUsername(user.username)
        setUsername(user.username)
      }
      setProfilePublic(user?.profilePublic ?? true)
    })
    fetch('/api/submissions').then((r) => r.json()).then(({ submissions }) => {
      setSubmissions(submissions ?? [])
    })
  }, [session])

  async function saveUsername(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setMessage({ text: data.error, error: true })
    } else {
      setSavedUsername(data.username)
      setMessage({ text: 'Username saved', error: false })
    }
  }

  async function togglePrivacy() {
    const next = !profilePublic
    setProfilePublic(next)
    await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profilePublic: next }),
    })
  }

  if (status === 'loading' || !session) return null

  const statusLabel = (s: string) => {
    if (s === 'approved') return <span className="text-green-400 text-xs">Approved</span>
    if (s === 'rejected') return <span className="text-red-400 text-xs">Rejected</span>
    return <span className="text-zinc-500 text-xs">Pending review</span>
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-xl font-bold text-zinc-100">Settings</h1>

      {/* Username */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">Profile</h2>
        <form onSubmit={saveUsername} className="space-y-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Username</label>
            <div className="flex gap-2">
              <div className="flex items-center h-9 px-3 rounded-l-md bg-zinc-900 border border-r-0 border-zinc-800 text-zinc-600 text-sm select-none">
                jackbook.app/u/
              </div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-username"
                minLength={3}
                maxLength={30}
                className="flex-1 h-9 px-3 rounded-r-md bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <p className="text-xs text-zinc-600 mt-1">Letters, numbers, _ and - only. 3–30 characters.</p>
          </div>

          {message && (
            <p className={`text-sm ${message.error ? 'text-red-400' : 'text-green-400'}`}>{message.text}</p>
          )}

          <button
            type="submit"
            disabled={saving || !username.trim() || username === savedUsername}
            className="h-9 px-4 rounded-md bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {saving ? 'Saving…' : 'Save username'}
          </button>

          {savedUsername && (
            <Link
              href={`/u/${savedUsername}`}
              className="inline-flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors ml-3"
            >
              View profile <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </form>

        {/* Privacy toggle */}
        <div className="flex items-center justify-between py-3 border-t border-zinc-800">
          <div>
            <p className="text-sm text-zinc-300">Public profile</p>
            <p className="text-xs text-zinc-600">Others can view your profile and approved submissions</p>
          </div>
          <button
            onClick={togglePrivacy}
            className={`relative w-10 h-5 rounded-full transition-colors ${profilePublic ? 'bg-violet-600' : 'bg-zinc-700'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${profilePublic ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </section>

      {/* Submissions */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">Your submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-zinc-600 text-sm">No submissions yet.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 py-3 border-b border-zinc-800">
                <div className="min-w-0">
                  <p className="text-sm text-zinc-200 font-medium truncate">{s.moveName}</p>
                  <a
                    href={s.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors truncate block"
                  >
                    {s.videoUrl}
                  </a>
                </div>
                {statusLabel(s.status)}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
