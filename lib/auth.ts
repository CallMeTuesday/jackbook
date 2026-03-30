import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db'

const isDev = process.env.NODE_ENV === 'development'

const providers = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

if (isDev) {
  providers.push(
    Credentials({
      name: 'Dev Login',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'dev' },
      },
      async authorize(credentials) {
        if (credentials?.username) {
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
  session: { strategy: 'jwt' },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
