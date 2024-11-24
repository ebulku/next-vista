import { Metadata } from 'next'
import { Toaster } from 'sonner'

import { ThemeProvider } from '@/components/theme-provider'

import { inter } from '@/styles/fonts'
import '@/styles/global.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Next Vista',
    default: 'Next Vista',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
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
