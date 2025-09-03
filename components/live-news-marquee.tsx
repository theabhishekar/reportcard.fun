/**
 * Live News Marquee Component
 * 
 * Displays top issue types and locations in a breaking news format
 * @author Chandravijay Agrawal
 */

"use client"

import { useEffect, useState } from "react"
import { githubStorage } from "@/lib/github-storage"

export function LiveNewsMarquee() {
  const [topIssueTypes, setTopIssueTypes] = useState<[string, number][]>([])
  const [topLocations, setTopLocations] = useState<[string, number][]>([])
  const [isMarqueeLoading, setIsMarqueeLoading] = useState(true)

  useEffect(() => {
    async function fetchMarqueeData() {
      try {
        setIsMarqueeLoading(true)
        const issues = await githubStorage.getGitHubIssues()
        if (issues && issues.length > 0) {
          // Parse issue data to extract issue types and locations
          const issueTypes: Record<string, number> = {}
          const locations: Record<string, number> = {}
          
          issues.forEach(issue => {
            const body = issue.body || ''
            
            // Extract issue type
            const issueTypeMatch = body.match(/\*\*Issue Type:\*\*\s*([^\n]+)/)
            if (issueTypeMatch) {
              const issueType = issueTypeMatch[1].trim()
              issueTypes[issueType] = (issueTypes[issueType] || 0) + 1
            }
            
            // Extract location
            const locationMatch = body.match(/\*\*Location:\*\*\s*([^\n]+)/)
            if (locationMatch) {
              const location = locationMatch[1].trim()
              locations[location] = (locations[location] || 0) + 1
            }
          })
          
          // Convert to sorted arrays
          const sortedIssueTypes = Object.entries(issueTypes)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
          
          const sortedLocations = Object.entries(locations)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
          
          setTopIssueTypes(sortedIssueTypes)
          setTopLocations(sortedLocations)
        }
      } catch (error) {
        console.error('Error fetching marquee data:', error)
      } finally {
        setIsMarqueeLoading(false)
      }
    }
    
    fetchMarqueeData()
  }, [])

  if (isMarqueeLoading || (topIssueTypes.length === 0 && topLocations.length === 0)) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200">
      <div className="overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          <div className="flex items-center gap-8 px-4 py-2 text-sm">
            <span className="font-bold text-red-700">🚨 BREAKING:</span>
            <span className="text-red-600">Top Issue Types:</span>
            {topIssueTypes.map(([type, count], index) => (
              <span key={index} className="text-red-800">
                {type} ({count})
              </span>
            ))}
            <span className="text-red-600">| Top Locations:</span>
            {topLocations.map(([location, count], index) => (
              <span key={index} className="text-red-800">
                {location} ({count})
              </span>
            ))}
            <span className="text-red-600">| Top Issue Types:</span>
            {topIssueTypes.map(([type, count], index) => (
              <span key={index} className="text-red-800">
                {type} ({count})
              </span>
            ))}
            <span className="text-red-600">| Top Locations:</span>
            {topLocations.map(([location, count], index) => (
              <span key={index} className="text-red-800">
                {location} ({count})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
