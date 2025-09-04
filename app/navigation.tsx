'use client'

import { useState } from 'react'

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
              reportcard.fun
              <span className="text-sm font-normal text-gray-600 ml-2 hidden sm:inline">(Civic Issue Reporter)</span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
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

          {/* Mobile Menu Button - Bigger, Darker, More Prominent */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-12 h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-3 pt-4">
              <a
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
              <a
                href="/civic"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Generate
              </a>
              <a
                href="/analytics"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium bg-blue-50 px-3 py-2 rounded-md inline-block"
                onClick={() => setIsOpen(false)}
              >
                📊 Analytics
              </a>
              <a
                href="/terms"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Terms
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}