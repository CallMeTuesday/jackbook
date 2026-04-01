import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-16 py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <span>© 2026 Jackbook</span>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/about" className="hover:text-zinc-300 transition-colors">About</Link>
          <Link href="/faq" className="hover:text-zinc-300 transition-colors">FAQ</Link>
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-zinc-300 transition-colors">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}
