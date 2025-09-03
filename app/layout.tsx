import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/language-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Civic Issue Reporting App',
  description: 'A modern web application for reporting and tracking civic issues in your community. Created by Chandravijay Agrawal.',
  generator: 'Next.js',
  authors: [{ name: 'Chandravijay Agrawal', url: 'https://twitter.com/Mehonestperson' }],
  keywords: ['civic issues', 'community reporting', 'government accountability', 'public service'],
  creator: 'Chandravijay Agrawal',
  publisher: 'Chandravijay Agrawal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
