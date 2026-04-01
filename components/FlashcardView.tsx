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
  const startX = useRef(0)
  const didDrag = useRef(false)

  // Reset to first card when the move set changes (style switch, search)
  useEffect(() => { setIndex(0) }, [moves])

  if (moves.length === 0) {
    return <p className="text-zinc-500 text-sm text-center py-12">No moves found.</p>
  }

  const clampedIndex = Math.min(index, moves.length - 1)
  const card = moves[clampedIndex]
  // Show next card peeking behind normally; when dragging right, show the previous card
  const behind = dragging && dragX > 0 ? moves[clampedIndex - 1] : moves[clampedIndex + 1]

  function goPrev() { if (clampedIndex > 0) setIndex(clampedIndex - 1) }
  function goNext() { if (clampedIndex < moves.length - 1) setIndex(clampedIndex + 1) }

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    didDrag.current = false
    setDragging(true)
  }

  function onTouchMove(e: React.TouchEvent) {
    const dx = e.touches[0].clientX - startX.current
    if (Math.abs(dx) > 6) didDrag.current = true
    setDragX(dx)
  }

  function onTouchEnd() {
    if (dragX < -THRESHOLD) goNext()
    else if (dragX > THRESHOLD) goPrev()
    setDragX(0)
    setDragging(false)
  }

  const { from, to } = getMoveGradient(card.name)

  return (
    <div className="relative select-none max-w-sm mx-auto" style={{ height: 'calc(100dvh - 11rem)' }}>
      {/* Card peeking behind */}
      {behind && (() => {
        const { from: bf, to: bt } = getMoveGradient(behind.name)
        return (
          <div
            aria-hidden
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${bf}, ${bt})`,
              transform: 'scale(0.93)',
              opacity: 0.5,
            }}
          >
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
          transform: `translateX(${dragX}px) rotate(${dragX * 0.033}deg)`,
          transition: dragging ? 'none' : 'transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          touchAction: 'pan-y',
          willChange: 'transform',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {card.thumbnail && (
          <>
            <Image src={card.thumbnail} alt={card.name} fill className="object-cover" sizes="100vw" priority />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${from}cc, ${to}99)` }} />
          </>
        )}

        {/* Tap target — navigate to move page, suppressed if swipe happened */}
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

      {/* Counter + prev/next buttons */}
      <div className="absolute -bottom-9 left-0 right-0 flex items-center justify-between px-1">
        <button
          onClick={goPrev}
          disabled={clampedIndex === 0}
          className="p-1.5 text-zinc-600 hover:text-zinc-300 disabled:opacity-20 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs text-zinc-600 tabular-nums">
          {clampedIndex + 1} / {moves.length}
        </span>
        <button
          onClick={goNext}
          disabled={clampedIndex === moves.length - 1}
          className="p-1.5 text-zinc-600 hover:text-zinc-300 disabled:opacity-20 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
