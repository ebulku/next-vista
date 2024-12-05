import { Metadata } from 'next'
import { Toaster } from 'sonner'

import { ThemeProvider } from '@/components/theme-provider'

import { inter } from '@/styles/fonts'
import '@/styles/global.css'

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'Next Vista'}`,
    default: process.env.NEXT_PUBLIC_APP_NAME || 'Next Vista',
  },
  description:
    process.env.NEXT_PUBLIC_DESCRIPTION ||
    'Next.js 15 Admin Dashboard with Prisma and shadcn/ui',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
