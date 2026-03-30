'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Music2, Search, X } from 'lucide-react'

const isDev = process.env.NEXT_PUBLIC_DEV_AUTH === 'true'

interface NavbarProps {
  search?: string
  onSearchChange?: (v: string) => void
}

export function Navbar({ search: externalSearch, onSearchChange }: NavbarProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isHome = pathname === '/'

  const [inputValue, setInputValue] = useState(externalSearch ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isHome) setInputValue(externalSearch ?? '')
  }, [externalSearch, isHome])

  function handleInput(value: string) {
    setInputValue(value)
    if (isHome && onSearchChange) {
      onSearchChange(value)
    } else {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams()
        if (value) params.set('q', encodeURIComponent(value))
        const view = searchParams.get('view')
        if (view) params.set('view', view)
        router.push(params.toString() ? `/?${params.toString()}` : '/')
      }, 300)
    }
  }

  // Dev login form state
  const [devUsername, setDevUsername] = useState('')
  const [showDevForm, setShowDevForm] = useState(false)
  const [signingIn, setSigningIn] = useState(false)

  async function handleDevLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!devUsername.trim()) return
    setSigningIn(true)
    await signIn('credentials', { username: devUsername.trim(), redirect: false })
    setSigningIn(false)
    setShowDevForm(false)
    setDevUsername('')
  }

  const authSlot = (
    <div className="flex items-center shrink-0">
      {status === 'loading' ? (
        <div className="h-7 w-7 bg-zinc-800 rounded-full animate-pulse" />
      ) : session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:opacity-80 transition-opacity">
              <Avatar className="h-7 w-7">
                <AvatarImage src={session.user?.image ?? ''} alt={session.user?.name ?? ''} />
                <AvatarFallback className="bg-violet-700 text-white text-xs">
                  {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
            <DropdownMenuItem className="text-zinc-400 text-xs pointer-events-none">
              {session.user?.name}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="text-zinc-300 hover:text-white cursor-pointer">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-zinc-300 hover:text-white cursor-pointer"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : isDev && showDevForm ? (
        <form onSubmit={handleDevLogin} className="flex items-center gap-1.5">
          <input
            value={devUsername}
            onChange={(e) => setDevUsername(e.target.value)}
            placeholder="username"
            autoFocus
            className="h-7 w-20 px-2 rounded bg-zinc-900 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={signingIn || !devUsername.trim()}
            className="h-7 px-2 rounded text-xs bg-violet-700 hover:bg-violet-600 text-white disabled:opacity-50"
          >
            {signingIn ? '…' : 'Go'}
          </button>
          <button type="button" onClick={() => setShowDevForm(false)} className="text-zinc-600 hover:text-zinc-400">
            <X className="h-3.5 w-3.5" />
          </button>
        </form>
      ) : (
        <button
          onClick={() => isDev ? setShowDevForm(true) : signIn('google', { callbackUrl: '/' })}
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          Sign in
        </button>
      )}
    </div>
  )

  const searchInput = (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
      <input
        value={inputValue}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Search"
        className="w-full h-8 pl-8 pr-7 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
      />
      {inputValue && (
        <button onClick={() => handleInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-4">
        <div className="hidden md:grid md:grid-cols-[1fr_minmax(0,40rem)_1fr] md:items-center md:h-14 md:gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-zinc-100 hover:text-white transition-colors">
            <Music2 className="h-5 w-5 text-violet-400" />
            <span className="font-bold text-base">Jackbook</span>
          </Link>
          {searchInput}
          <div className="flex justify-end">{authSlot}</div>
        </div>

        <div className="flex md:hidden items-center gap-3 h-14">
          <Link href="/" className="flex items-center gap-1.5 text-zinc-100 hover:text-white transition-colors shrink-0">
            <Music2 className="h-5 w-5 text-violet-400" />
          </Link>
          <div className="flex-1 min-w-0">{searchInput}</div>
          {authSlot}
        </div>
      </div>
    </nav>
  )
}
