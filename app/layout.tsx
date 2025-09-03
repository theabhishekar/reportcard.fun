import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/language-context'
import { LiveNewsMarquee } from '@/components/live-news-marquee'
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
                  reportcard.fun
                  <span className="text-sm font-normal text-gray-600 ml-2">(Civic Issue Reporter)</span>
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
                  href="/analytics"
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
