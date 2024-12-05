import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isDemo = process.env.NEXT_PUBLIC_ENVIRONMENT === 'demo'
      const isWelcomePage = nextUrl.pathname === '/'

      if (isWelcomePage) {
        if (!isDemo) {
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
        return true
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
