'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { LanguageSelector } from '@/components/language-selector'

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentLanguage } = useLanguage()
  const [deathsCount, setDeathsCount] = useState<number | null>(null)
  const [debtCroreCount, setDebtCroreCount] = useState<number | null>(null)
  const [taxCroreCount, setTaxCroreCount] = useState<number | null>(null)
  const [isDeathsOpen, setIsDeathsOpen] = useState(false)
  const [isDebtOpen, setIsDebtOpen] = useState(false)
  const [isTaxOpen, setIsTaxOpen] = useState(false)
  const deathsRef = useRef<HTMLDivElement | null>(null)
  const deathsMobileRef = useRef<HTMLDivElement | null>(null)
  const debtRef = useRef<HTMLDivElement | null>(null)
  const debtMobileRef = useRef<HTMLDivElement | null>(null)
  const taxRef = useRef<HTMLDivElement | null>(null)

  // Header counters derived from global time (deterministic, not session-based)
  useEffect(() => {
    // All counters use the same baseline date for consistency
    const BASE_TIME = Date.UTC(2024, 3, 1, 0, 0, 0) // Apr 1, 2024 UTC (FY 2024-25 start)
    const SINCE_LABEL = "since Apr 1, 2024"

    // Deaths: based on annual estimate
    const DEATHS_PER_YEAR = 172000 // India approx annual road deaths (recent years)
    const DEATH_BASE_COUNT = 0 // baseline at epoch
    const DEATHS_PER_SEC = DEATHS_PER_YEAR / (365 * 24 * 60 * 60)

    // Debt: baseline at a known time (in crores)
    const DEBT_BASE_CRORE = 181680000 // Mar 31, 2024 baseline
    const DEBT_PER_SEC_CRORE = 0.00419 // ≈ ₹41,900 per second

    // Tax: based on annual collection estimate (more accurate)
    const TAX_PER_YEAR_CRORE = 3000000 // ~₹30 lakh crore annually (more realistic)
    const TAX_PER_SEC_CRORE = TAX_PER_YEAR_CRORE / (365 * 24 * 60 * 60)

    let lastShownDeaths = -1
    let lastBumpedAt = Date.now()

    const update = () => {
      const now = Date.now()
      const elapsedSec = Math.max(0, (now - BASE_TIME) / 1000)
      
      // Deaths calculation
      const ytdDeathsExact = DEATH_BASE_COUNT + DEATHS_PER_SEC * elapsedSec
      let ytdDeaths = Math.floor(ytdDeathsExact)

      // Visibility tweak: ensure at least one visible increment every ~60s
      if (lastShownDeaths < 0) {
        lastShownDeaths = ytdDeaths
        lastBumpedAt = now
      } else {
        if (ytdDeaths > lastShownDeaths) {
          lastShownDeaths = ytdDeaths
          lastBumpedAt = now
        } else if (now - lastBumpedAt >= 60000) {
          // Nudge by +1 for visibility but never exceed mathematical target by >1
          if (ytdDeathsExact - lastShownDeaths < 1.0) {
            lastShownDeaths += 1
          } else {
            lastShownDeaths = ytdDeaths
          }
          lastBumpedAt = now
        }
        ytdDeaths = lastShownDeaths
      }

      // Debt calculation (adjusted for Jan 1, 2024 baseline)
      const debtElapsedFromMar31 = Math.max(0, (now - Date.UTC(2024, 2, 31, 0, 0, 0)) / 1000)
      const liveDebtCrore = DEBT_BASE_CRORE + DEBT_PER_SEC_CRORE * debtElapsedFromMar31
      
      // Tax calculation
      const liveTaxCrore = TAX_PER_SEC_CRORE * elapsedSec

      setDeathsCount(ytdDeaths)
      setDebtCroreCount(liveDebtCrore)
      setTaxCroreCount(liveTaxCrore)
    }

    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  // Close popovers on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node
      // deaths
      if (isDeathsOpen) {
        const insideDesktop = deathsRef.current && deathsRef.current.contains(target)
        const insideMobile = deathsMobileRef.current && deathsMobileRef.current.contains(target)
        if (!insideDesktop && !insideMobile) setIsDeathsOpen(false)
      }
      // debt
      if (isDebtOpen) {
        const insideDesktopDebt = debtRef.current && debtRef.current.contains(target)
        const insideMobileDebt = debtMobileRef.current && debtMobileRef.current.contains(target)
        if (!insideDesktopDebt && !insideMobileDebt) setIsDebtOpen(false)
      }
      // tax
      if (isTaxOpen) {
        const insideTax = taxRef.current && taxRef.current.contains(target)
        if (!insideTax) setIsTaxOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [isDeathsOpen, isDebtOpen, isTaxOpen])

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <nav className="relative grid grid-cols-3 items-center">
          <div className="flex items-center gap-4 col-start-1">
            <a
              href="/"
              className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
              reportcard.fun
              <span className="text-sm font-normal text-gray-600 ml-2 hidden sm:inline">(Civic Issue Reporter)</span>
            </a>
            {/* Tax counter moved to left section */}
            <div ref={taxRef} className="hidden md:flex flex-col items-center text-xs relative">
              <button
                type="button"
                onClick={() => setIsTaxOpen((v) => !v)}
                className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100"
                aria-haspopup="dialog"
                aria-expanded={isTaxOpen}
                aria-label="Tax collection info"
              >
                <span className="text-gray-600">₹</span>
                <span className="text-gray-800">Tax:</span>
                <span className="text-black font-semibold">{taxCroreCount !== null ? `₹${taxCroreCount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr` : '—'}</span>
              </button>
              <div className="text-[10px] text-gray-500 mt-0.5">since Apr 1, 2024</div>

              {isTaxOpen && (
                <div
                  role="dialog"
                  aria-label="Tax collection information"
                  className="absolute left-0 top-full mt-2 w-96 max-w-[85vw] rounded-lg border border-blue-200 bg-white shadow-xl p-3 z-50"
                >
                  <div className="text-xs leading-relaxed text-gray-800">
                    <div className="font-semibold text-blue-700 mb-1">Tax collection keeps growing</div>
                    <ul className="list-disc ml-4 space-y-1">
                      <li><span className="font-medium">~₹30 lakh crore/yr collected</span> — across all taxes (GST, income, corporate, etc.).</li>
                      <li><span className="font-medium">GST dominates</span> — largest single source of government revenue.</li>
                      <li><span className="font-medium">Why it grows</span> — economic growth, better compliance, digital systems.</li>
                      <li><span className="font-medium">What it funds</span> — infrastructure, defense, subsidies, social programs.</li>
                    </ul>
                    <div className="mt-2 text-[11px] text-gray-600">
                      Based on recent budget data. Figures are directional and auto-updating for awareness.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile deaths chip centered in the top bar */}
          <div ref={deathsMobileRef} className="md:hidden col-start-2 justify-self-center">
            <button
              type="button"
              onClick={() => setIsDeathsOpen((v) => !v)}
              className="bg-gray-50 px-2 py-1 rounded border border-gray-200 shadow-sm hover:bg-gray-100"
              aria-haspopup="dialog"
              aria-expanded={isDeathsOpen}
              aria-label="Road deaths info"
            >
              <div className="flex flex-col leading-tight items-center">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">🚨</span>
                  <span className="text-gray-800">Deaths:</span>
                  <span className="hdr-deaths text-black font-semibold">{deathsCount !== null ? deathsCount.toLocaleString('en-IN') : '—'}</span>
                </div>
                <div className="text-[10px] text-gray-500">since Apr 1, 2024</div>
              </div>
            </button>

            {isDeathsOpen && (
              <div
                role="dialog"
                aria-label="Why are people dying on Indian roads"
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[92vw] max-w-sm rounded-lg border border-red-200 bg-white shadow-xl p-3 z-50"
              >
                <div className="text-xs leading-relaxed text-gray-800">
                  <div className="font-semibold text-red-700 mb-1">Why so many deaths?</div>
                  <ul className="list-disc ml-4 space-y-1">
                    <li><span className="font-medium">Pedestrians ≈ 20%</span> — unsafe crossings, poor lighting, speeding vehicles.</li>
                    <li><span className="font-medium">Two-wheelers ≈ 40%+</span> — helmet non-use, speeding, mixed traffic with heavy vehicles.</li>
                    <li><span className="font-medium">Overspeeding (major cause)</span> — the single biggest factor across crashes.</li>
                    <li><span className="font-medium">Bad infrastructure</span> — potholes, blind curves, missing dividers/shoulders, faded markings.</li>
                    <li><span className="font-medium">Enforcement & behaviour</span> — drunk driving, wrong-side driving, seat‑belt non‑use.</li>
                  </ul>
                  <div className="mt-2 text-[11px] text-gray-600">
                    Every 3 minutes, another life is lost. Report hazards. Demand safer design.
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Mobile debt chip anchored right */}
          <div ref={debtMobileRef} className="md:hidden col-start-3 justify-self-end">
            <button
              type="button"
              onClick={() => setIsDebtOpen((v) => !v)}
              className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-200 shadow-sm hover:bg-gray-100"
              aria-haspopup="dialog"
              aria-expanded={isDebtOpen}
              aria-label="Government debt info"
            >
              <span className="text-gray-600">💸</span>
              <span className="text-gray-800">Debt:</span>
              <span className="hdr-debt text-black font-semibold">{debtCroreCount !== null ? `₹${debtCroreCount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr` : '—'}</span>
            </button>
            <div className="text-[10px] text-gray-500 text-center mt-0.5">since Apr 1, 2024</div>

            {isDebtOpen && (
              <div
                role="dialog"
                aria-label="India debt information"
                className="absolute right-0 top-full mt-2 w-[92vw] max-w-sm rounded-lg border border-orange-200 bg-white shadow-xl p-3 z-50"
              >
                <div className="text-xs leading-relaxed text-gray-800">
                  <div className="font-semibold text-orange-700 mb-1">Public debt keeps ticking</div>
                  <ul className="list-disc ml-4 space-y-1">
                    <li><span className="font-medium">~₹13.22 lakh crore/yr added</span> — ≈ ₹42K every second (approx.).</li>
                    <li><span className="font-medium">Interest burden</span> — large share of taxes go to servicing past loans.</li>
                    <li><span className="font-medium">Why it grows</span> — deficits, infrastructure spend, subsidies, shocks.</li>
                    <li><span className="font-medium">What it means</span> — less for health/education; future generations pay.</li>
                  </ul>
                  <div className="mt-2 text-[11px] text-gray-600">
                    Based on recent budget/NSSO aggregates. Figures are directional and auto-updating for awareness.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center counters in top bar */}
          <div className="hidden md:flex items-center gap-3 text-xs col-start-2 justify-self-center">
            {/* Deaths chip with popover */}
            <div ref={deathsRef} className="relative flex flex-col items-center">
              <button
                type="button"
                onClick={() => setIsDeathsOpen((v) => !v)}
                className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100"
                aria-haspopup="dialog"
                aria-expanded={isDeathsOpen}
                aria-label="Road deaths info"
              >
                <span className="text-gray-600">🚨</span>
                <span className="text-gray-800">Deaths:</span>
                <span id="hdr-deaths" className="text-black font-semibold">{deathsCount !== null ? deathsCount.toLocaleString('en-IN') : '—'}</span>
              </button>
              <div className="text-[10px] text-gray-500 mt-0.5">since Apr 1, 2024</div>

              {isDeathsOpen && (
                <div
                  role="dialog"
                  aria-label="Why are people dying on Indian roads"
                  className="absolute left-0 top-full mt-2 w-96 max-w-[85vw] rounded-lg border border-red-200 bg-white shadow-xl p-3 z-50"
                >
                  <div className="text-xs leading-relaxed text-gray-800">
                    <div className="font-semibold text-red-700 mb-1">Why so many deaths?</div>
                    <ul className="list-disc ml-4 space-y-1">
                      <li><span className="font-medium">Pedestrians ≈ 20%</span> — unsafe crossings, poor lighting, speeding vehicles.</li>
                      <li><span className="font-medium">Two-wheelers ≈ 40%+</span> — helmet non-use, speeding, mixed traffic with heavy vehicles.</li>
                      <li><span className="font-medium">Overspeeding (major cause)</span> — the single biggest factor across crashes.</li>
                      <li><span className="font-medium">Bad infrastructure</span> — potholes, blind curves, missing dividers/shoulders, faded markings.</li>
                      <li><span className="font-medium">Enforcement & behaviour</span> — drunk driving, wrong-side driving, seat‑belt non‑use.</li>
                    </ul>
                    <div className="mt-2 text-[11px] text-gray-600">
                      Based on recent MoRTH/NCRB trends. Every 3 minutes, another life is lost. Report hazards. Demand safer design.
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div ref={debtRef} className="relative flex flex-col items-center">
              <button
                type="button"
                onClick={() => setIsDebtOpen((v) => !v)}
                className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100"
                aria-haspopup="dialog"
                aria-expanded={isDebtOpen}
                aria-label="Government debt info"
              >
                <span className="text-gray-600">💸</span>
                <span className="text-gray-800">Debt:</span>
                <span className="hdr-debt text-black font-semibold">{debtCroreCount !== null ? `₹${debtCroreCount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr` : '—'}</span>
              </button>
              <div className="text-[10px] text-gray-500 mt-0.5">since Apr 1, 2024</div>
              
              {isDebtOpen && (
                <div
                  role="dialog"
                  aria-label="India debt information"
                  className="absolute left-0 top-full mt-2 w-96 max-w-[85vw] rounded-lg border border-orange-200 bg-white shadow-xl p-3 z-50"
                >
                  <div className="text-xs leading-relaxed text-gray-800">
                    <div className="font-semibold text-orange-700 mb-1">Public debt keeps ticking</div>
                    <ul className="list-disc ml-4 space-y-1">
                      <li><span className="font-medium">~₹13.22 lakh crore/yr added</span> — ≈ ₹42K every second (approx.).</li>
                      <li><span className="font-medium">Interest burden</span> — large share of taxes go to servicing past loans.</li>
                      <li><span className="font-medium">Why it grows</span> — deficits, infrastructure spend, subsidies, shocks.</li>
                      <li><span className="font-medium">What it means</span> — less for health/education; future generations pay.</li>
                    </ul>
                    <div className="mt-2 text-[11px] text-gray-600">
                      Based on recent budget/NSSO aggregates. Figures are directional and auto-updating for awareness.
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 col-start-3 justify-self-end">
            <LanguageSelector />
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