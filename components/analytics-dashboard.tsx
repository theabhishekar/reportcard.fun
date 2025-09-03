/**
 * Analytics Dashboard Component
 * 
 * Displays civic issue data directly from GitHub Issues in tabular format
 * @author Chandravijay Agrawal
 */

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { githubStorage } from "@/lib/github-storage"

interface CivicIssue {
  number: number
  title: string
  body: string
  labels: string[]
  created_at: string
  state: string
  html_url: string
}

interface IssueSummary {
  issueType: string
  location: string
  date: string
  userId: string
  status: string
  url: string
}

export function AnalyticsDashboard() {
  const [issues, setIssues] = useState<CivicIssue[]>([])
  const [issueSummaries, setIssueSummaries] = useState<IssueSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadIssues() {
      try {
        setLoading(true)
        const data = await githubStorage.getGitHubIssues()
        if (data) {
          setIssues(data)
          // Parse issue data into summaries
          const summaries = data.map(issue => {
            const body = issue.body || ''
            const issueType = extractField(body, 'Issue Type') || 'Unknown'
            const location = extractField(body, 'Location') || 'Unknown'
            const date = extractField(body, 'Date') || issue.created_at
            const userId = extractField(body, 'User ID') || 'anonymous'
            
            return {
              issueType,
              location,
              date,
              userId,
              status: issue.state,
              url: issue.html_url
            }
          })
          setIssueSummaries(summaries)
        } else {
          setError('No issues data available')
        }
      } catch (err) {
        setError('Failed to load issues data')
        console.error('Issues error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadIssues()
  }, [])

  // Helper function to extract field values from issue body
  function extractField(body: string, fieldName: string): string | null {
    const regex = new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*([^\\n]+)`)
    const match = body.match(regex)
    return match ? match[1].trim() : null
  }

  // Calculate summary statistics
  const totalIssues = issues.length
  const openIssues = issues.filter(issue => issue.state === 'open').length
  const closedIssues = issues.filter(issue => issue.state === 'closed').length
  
  // Count issue types
  const issueTypeCounts = issueSummaries.reduce((acc, issue) => {
    acc[issue.issueType] = (acc[issue.issueType] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Count locations
  const locationCounts = issueSummaries.reduce((acc, issue) => {
    acc[issue.location] = (acc[issue.location] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Count users
  const userCounts = issueSummaries.reduce((acc, issue) => {
    acc[issue.userId] = (acc[issue.userId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading civic issues data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-gray-600 mt-2">
          Data will be available once reports are stored in GitHub Issues
        </p>
      </div>
    )
  }

  if (!issues.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No civic issues found yet.</p>
        <p className="text-sm text-gray-500 mt-2">
          Generate some certificates to see the data here!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalIssues.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Open Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {openIssues.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Closed Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {closedIssues.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Issue Types Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(issueTypeCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([type, count]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="capitalize">{type}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Locations Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(locationCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([location, count]) => (
                  <div key={location} className="flex justify-between text-sm">
                    <span className="truncate">{location}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Users Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Top Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(userCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([user, count]) => (
                  <div key={user} className="flex justify-between text-sm">
                    <span>{user === 'anonymous' ? 'Anonymous' : user}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Issues Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Civic Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Issue Type</th>
                  <th className="text-left py-2 font-medium">Location</th>
                  <th className="text-left py-2 font-medium">User</th>
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th className="text-left py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issueSummaries.map((issue, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 capitalize">{issue.issueType}</td>
                    <td className="py-2">{issue.location}</td>
                    <td className="py-2">{issue.userId === 'anonymous' ? 'Anonymous' : issue.userId}</td>
                    <td className="py-2">{new Date(issue.date).toLocaleDateString()}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        issue.status === 'open' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="py-2">
                      <a 
                        href={issue.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        View Issue
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Data Source Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Data sourced directly from GitHub Issues repository</p>
        <p>Reports are automatically stored when citizens generate certificates</p>
      </div>
    </div>
  )
}
