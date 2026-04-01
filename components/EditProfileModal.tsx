'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { X, Camera } from 'lucide-react'

interface ProfileData {
  name: string | null
  username: string | null
  pronouns: string | null
  bio: string | null
  image: string | null
  profilePublic: boolean
}

interface Props {
  profile: ProfileData
  onClose: () => void
  onSave: (updated: ProfileData) => void
}

export function EditProfileModal({ profile, onClose, onSave }: Props) {
  const [name, setName] = useState(profile.name ?? '')
  const [username, setUsername] = useState(profile.username ?? '')
  const [pronouns, setPronouns] = useState(profile.pronouns ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [image, setImage] = useState(profile.image ?? '')
  const [profilePublic, setProfilePublic] = useState(profile.profilePublic)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    if (!res.ok) { setError(data.error ?? 'Upload failed'); return }
    setImage(data.url)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const res = await fetch('/api/me/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, pronouns, bio, image, profilePublic }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error ?? 'Save failed'); return }
    onSave(data.user)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-md bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-800 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-100">Edit Profile</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="relative group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden bg-violet-800 flex items-center justify-center">
                {image ? (
                  <Image src={image} alt="Avatar" fill className="object-cover rounded-full" />
                ) : (
                  <span className="text-white text-2xl font-bold">{name?.[0]?.toUpperCase() ?? '?'}</span>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Display name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                placeholder="Your name"
                className="w-full h-9 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1">Username</label>
              <div className="flex h-9 rounded-md bg-zinc-800 border border-zinc-700 focus-within:border-zinc-500 overflow-hidden">
                <span className="flex items-center pl-3 pr-1 text-sm text-zinc-500 select-none">@</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  maxLength={30}
                  placeholder="handle"
                  className="flex-1 min-w-0 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none pr-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1">Pronouns</label>
              <input
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                maxLength={40}
                placeholder="e.g. they/them"
                className="w-full h-9 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1">
                Bio <span className="text-zinc-600">({bio.length}/200)</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 200))}
                rows={3}
                placeholder="A little about you…"
                className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-zinc-800">
            <div>
              <p className="text-sm text-zinc-300">Public profile</p>
              <p className="text-xs text-zinc-600">Others can view your profile</p>
            </div>
            <button
              type="button"
              onClick={() => setProfilePublic((v) => !v)}
              aria-label="Toggle public profile"
              className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${profilePublic ? 'bg-violet-600' : 'bg-zinc-700'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${profilePublic ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full h-10 rounded-full bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  )
}
