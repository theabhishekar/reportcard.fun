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
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <a
                  href="/"
                  className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                >
                  Civic Issue Reporter
                </a>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </a>
                <a
                  href="/civic"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Generate
                </a>
                <a
                  href="/admin"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Admin
                </a>
                                 <a
                   href="/admin"
                   className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium bg-blue-50 px-3 py-1 rounded-md"
                 >
                   📊 Analytics
                 </a>
                 <a
                   href="/terms"
                   className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                 >
                   Terms
                 </a>
              </div>
            </nav>
          </div>
        </header>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
