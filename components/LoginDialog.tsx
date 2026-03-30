'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Music2 } from 'lucide-react'

const isDev = process.env.NEXT_PUBLIC_DEV_AUTH === 'true'

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  callbackUrl?: string
}

export function LoginDialog({ open, onOpenChange, callbackUrl }: LoginDialogProps) {
  const [devUsername, setDevUsername] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  async function handleDevLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!devUsername.trim()) return
    setSigningIn(true)
    await signIn('credentials', { username: devUsername.trim(), redirect: false })
    setSigningIn(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-sm">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex items-center justify-center gap-1.5">
            <Music2 className="h-5 w-5 text-violet-400" />
            <span className="font-bold text-zinc-100">Jackbook</span>
          </div>
          <DialogTitle className="text-zinc-100">Sign in to vote</DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            Vote for the best tutorial for this move.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          {isDev ? (
            <form onSubmit={handleDevLogin} className="space-y-2">
              <input
                value={devUsername}
                onChange={(e) => setDevUsername(e.target.value)}
                placeholder="Enter any username"
                autoFocus
                className="w-full h-9 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              <button
                type="submit"
                disabled={signingIn || !devUsername.trim()}
                className="w-full h-9 rounded-md bg-violet-700 hover:bg-violet-600 text-white text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {signingIn ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          ) : (
            <button
              onClick={() => signIn('google', { callbackUrl: callbackUrl ?? '/' })}
              className="w-full h-10 rounded-md bg-white hover:bg-zinc-100 text-zinc-900 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
