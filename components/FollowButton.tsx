'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'

interface Props {
  username: string
  initialFollowing: boolean
  initialCount: number
  onCountChange?: (count: number) => void
}

export function FollowButton({ username, initialFollowing, initialCount, onCountChange }: Props) {
  const { data: session } = useSession()
  const [following, setFollowing] = useState(initialFollowing)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (!session) { signIn(); return }
    setLoading(true)
    const res = await fetch(`/api/users/${username}/follow`, {
      method: following ? 'DELETE' : 'POST',
    })
    setLoading(false)
    if (res.ok) {
      const data = await res.json()
      setFollowing(data.isFollowing)
      setCount(data.followerCount)
      onCountChange?.(data.followerCount)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
        following
          ? 'border border-zinc-600 text-zinc-300 hover:border-zinc-400 hover:text-white'
          : 'bg-violet-700 hover:bg-violet-600 text-white'
      }`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  )
}
