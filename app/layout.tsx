import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { SessionProvider } from '@/components/SessionProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jackbook',
  description: 'Discover and organize video tutorials for house dance moves',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 min-h-screen`}>
        <SessionProvider>
          <Suspense>
            <Navbar />
          </Suspense>
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
