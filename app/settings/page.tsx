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

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-xl font-bold text-zinc-100">Settings</h1>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">Profile</h2>

        <form onSubmit={saveUsername} className="space-y-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Profile URL</label>
            <div className="flex h-9 rounded-md bg-zinc-900 border border-zinc-800 focus-within:border-zinc-600 overflow-hidden">
              <span className="flex items-center pl-3 pr-1 text-sm text-zinc-500 select-none whitespace-nowrap">
                {typeof window !== 'undefined' ? window.location.host : 'jackbook.app'}/
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-handle"
                minLength={3}
                maxLength={30}
                className="flex-1 min-w-0 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none pr-3"
              />
            </div>
            <p className="text-xs text-zinc-600 mt-1">Letters, numbers, _ and - only. 3–30 characters.</p>
          </div>

          {message && (
            <p className={`text-sm ${message.error ? 'text-red-400' : 'text-green-400'}`}>{message.text}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving || !username.trim() || username === savedUsername}
              className="h-9 px-4 rounded-md bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >
              {saving ? 'Saving…' : 'Save username'}
            </button>

            {savedUsername && (
              <Link
                href={`/${savedUsername}`}
                className="inline-flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                View profile <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </form>

        <div className="flex items-center justify-between py-3 border-t border-zinc-800">
          <div>
            <p className="text-sm text-zinc-300">Public profile</p>
            <p className="text-xs text-zinc-600">Others can view your profile and approved submissions</p>
          </div>
          <button
            onClick={togglePrivacy}
            aria-label="Toggle public profile"
            className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${profilePublic ? 'bg-violet-600' : 'bg-zinc-700'}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${profilePublic ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </section>
    </main>
  )
}
