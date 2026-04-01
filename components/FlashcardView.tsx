'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMoveGradient } from '@/lib/moveColor'

interface Move {
  id: string
  name: string
  slug: string
  thumbnail?: string | null
}

const THRESHOLD = 72

export function FlashcardView({ moves }: { moves: Move[] }) {
  const [index, setIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null)
  const [skipTransition, setSkipTransition] = useState(false)
  const startX = useRef(0)
  const didDrag = useRef(false)

  useEffect(() => { setIndex(0) }, [moves])

  useEffect(() => {
    if (!skipTransition) return
    const id = requestAnimationFrame(() => setSkipTransition(false))
    return () => cancelAnimationFrame(id)
  }, [skipTransition])

  if (moves.length === 0) {
    return <p className="text-zinc-500 text-sm text-center py-12">No moves found.</p>
  }

  const i = Math.min(index, moves.length - 1)
  const card = moves[i]

  // Only determine behind card direction once drag has started — fully symmetric
  const dragDir: 'left' | 'right' | null =
    exitDir ?? (dragX < -4 ? 'left' : dragX > 4 ? 'right' : null)
  const behindIndex = dragDir === 'left' ? i + 1 : dragDir === 'right' ? i - 1 : null
  const behind = behindIndex !== null ? moves[behindIndex] : undefined

  const dragProgress = exitDir ? 1 : Math.min(Math.abs(dragX) / THRESHOLD, 1)
  const behindScale = 0.93 + 0.07 * dragProgress
  const behindOpacity = 0.45 + 0.55 * dragProgress

  function advance(dir: 'left' | 'right') {
    if (dir === 'left' && i < moves.length - 1) setExitDir('left')
    else if (dir === 'right' && i > 0) setExitDir('right')
  }

  function onTransitionEnd() {
    if (!exitDir) return
    setSkipTransition(true)
    setIndex(exitDir === 'left' ? i + 1 : i - 1)
    setExitDir(null)
    setDragX(0)
    setDragging(false)
  }

  function onTouchStart(e: React.TouchEvent) {
    if (exitDir) return
    startX.current = e.touches[0].clientX
    didDrag.current = false
    setDragging(true)
  }

  function onTouchMove(e: React.TouchEvent) {
    if (exitDir) return
    const dx = e.touches[0].clientX - startX.current
    if (Math.abs(dx) > 6) didDrag.current = true
    setDragX(dx)
  }

  function onTouchEnd() {
    if (exitDir) return
    if (dragX < -THRESHOLD) advance('left')
    else if (dragX > THRESHOLD) advance('right')
    else { setDragX(0); setDragging(false) }
  }

  let activeTransform: string
  let activeTransition: string
  if (exitDir === 'left') {
    activeTransform = 'translateX(-130vw) rotate(-22deg)'
    activeTransition = 'transform 0.32s ease-in'
  } else if (exitDir === 'right') {
    activeTransform = 'translateX(130vw) rotate(22deg)'
    activeTransition = 'transform 0.32s ease-in'
  } else if (dragging || skipTransition) {
    activeTransform = `translateX(${dragX}px) rotate(${dragX * 0.033}deg)`
    activeTransition = 'none'
  } else {
    activeTransform = 'translateX(0) rotate(0deg)'
    activeTransition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }

  const { from, to } = getMoveGradient(card.name)

  return (
    <div className="select-none" style={{ height: 'calc(100dvh - 12rem)' }}>
      <div className="relative w-full h-full">

        {/* Behind card — only renders once drag direction is known */}
        {behind && (() => {
          const { from: bf, to: bt } = getMoveGradient(behind.name)
          return (
            <div
              aria-hidden
              className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${bf}, ${bt})`,
                transform: `scale(${behindScale})`,
                opacity: behindOpacity,
                transition: exitDir ? 'transform 0.32s ease-in, opacity 0.32s ease-in' : 'none',
              }}
            >
              {behind.thumbnail && (
                <Image src={behind.thumbnail} alt={behind.name} fill className="object-cover" sizes="100vw" />
              )}
              <p className="absolute bottom-6 left-6 font-bold text-white text-xl drop-shadow">
                {behind.name}
              </p>
            </div>
          )
        })()}

        {/* Active card */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${from}, ${to})`,
            transform: activeTransform,
            transition: activeTransition,
            touchAction: 'pan-y',
            willChange: 'transform',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTransitionEnd={onTransitionEnd}
        >
          {card.thumbnail && (
            <>
              <Image src={card.thumbnail} alt={card.name} fill className="object-cover" sizes="100vw" priority />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${from}cc, ${to}99)` }} />
            </>
          )}
          <Link
            href={`/moves/${card.slug}`}
            className="absolute inset-0 flex items-end p-6"
            onClick={(e) => { if (didDrag.current) e.preventDefault() }}
            draggable={false}
          >
            <p className="font-bold text-white leading-tight drop-shadow-lg" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}>
              {card.name}
            </p>
          </Link>
        </div>

      </div>

      {/* Counter + nav */}
      <div className="flex items-center justify-between px-1 mt-2">
        <button
          onClick={() => advance('right')}
          disabled={i === 0}
          className="p-1.5 text-zinc-600 hover:text-zinc-300 disabled:opacity-20 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs text-zinc-600 tabular-nums">{i + 1} / {moves.length}</span>
        <button
          onClick={() => advance('left')}
          disabled={i === moves.length - 1}
          className="p-1.5 text-zinc-600 hover:text-zinc-300 disabled:opacity-20 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
