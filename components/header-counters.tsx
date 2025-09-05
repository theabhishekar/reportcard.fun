"use client"

import { useEffect } from "react"

// Simple counter component for header
export function HeaderCounters() {
  useEffect(() => {
    let deathCount = 172000
    let debtCount = 181680000 // in crores

    const formatNumber = (num: number) => {
      if (num >= 100000) {
        return (num / 1000).toFixed(0) + 'K'
      }
      return num.toLocaleString()
    }

    const formatDebt = (num: number) => {
      return '₹' + (num / 10000000).toFixed(1) + 'L Cr'
    }

    const updateCounters = () => {
      const deathElement = document.getElementById('death-counter')
      const debtElement = document.getElementById('debt-counter')
      
      if (deathElement) {
        deathElement.textContent = formatNumber(deathCount)
      }
      if (debtElement) {
        debtElement.textContent = formatDebt(debtCount)
      }
    }

    // Initial update
    updateCounters()

    // Death counter: increment every 3 minutes
    const deathInterval = setInterval(() => {
      deathCount += 1
      updateCounters()
    }, 180000) // 3 minutes

    // Debt counter: increment every second
    const debtInterval = setInterval(() => {
      debtCount += 0.00419 // ₹41,900 per second
      updateCounters()
    }, 1000) // 1 second

    return () => {
      clearInterval(deathInterval)
      clearInterval(debtInterval)
    }
  }, [])

  return null // This component doesn't render anything, just manages the counters
}
