

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/language-context'
import { LiveNewsMarquee } from '@/components/live-news-marquee'
import { MobileNavigation } from './navigation'
import './globals.css'


export const metadata: Metadata = {
  title: 'Civic Issue Reporting App',
  description: 'A modern web application for reporting and tracking civic issues in your community. Created by Abhishekar.',
  generator: 'Next.js',
  authors: [{ name: 'Abhishekar', url: 'https://abhishekardev.vercel.app/about' }],
  keywords: ['civic issues', 'community reporting', 'government accountability', 'public service'],
  creator: 'Abhishekar',
  publisher: 'Abhishekar',
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
          <MobileNavigation />
          
          {/* Slim respectful note banner (single, non-distracting) */}
          <div className="border-b border-green-200 bg-green-50/70">
            <div className="mx-auto max-w-7xl px-4 py-2">
              <p className="text-xs text-green-800 text-center">
                🇮🇳 Respectful note to officials: citizen-run project to report civic issues via RTI in good faith. <a href="/terms" className="underline">Learn more</a>
              </p>
            </div>
          </div>

          {/* Live News Marquee - Global */}
          <LiveNewsMarquee />
          
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
