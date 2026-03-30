import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db'

const isDev = process.env.NODE_ENV === 'development'

const providers = []

// Only add Google if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  )
}

// Dev-only: sign in as a test user without any OAuth setup
if (isDev) {
  providers.push(
    Credentials({
      name: 'Dev Login',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'dev' },
      },
      async authorize(credentials) {
        if (credentials?.username) {
          // Upsert a local dev user so voting works
          const user = await prisma.user.upsert({
            where: { email: `${credentials.username}@dev.local` },
            update: {},
            create: {
              email: `${credentials.username}@dev.local`,
              name: String(credentials.username),
            },
          })
          return { id: user.id, name: user.name, email: user.email }
        }
        return null
      },
    })
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: isDev ? { strategy: 'jwt' } : { strategy: 'database' },
  providers,
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        // JWT strategy (dev): id comes from token
        // Database strategy (prod): id comes from user
        session.user.id = (token?.sub ?? user?.id) as string
        if (user?.id) {
          const account = await prisma.account.findFirst({
            where: { userId: user.id, provider: 'google' },
            select: { access_token: true },
          })
          if (account?.access_token) {
            ;(session as any).accessToken = account.access_token
          }
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/',
  },
})
