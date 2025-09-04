

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
        <MobileNavigation />
        
        {/* Professional Government Appeal Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="text-center">
              <p className="text-sm text-green-800 font-medium">
                🇮🇳 <strong>Respectful Note to Hon'ble Officials:</strong> This is a simple spare time project by a citizen to help report civic issues constructively. 
                Created with good intentions to support community improvement through proper RTI channels. 
                <span className="text-green-900">🙏 Humbly seeking your understanding and guidance.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Live News Marquee - Global */}
        <LiveNewsMarquee />
        
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
