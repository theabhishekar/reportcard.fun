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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [sortField, setSortField] = useState<keyof IssueSummary>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

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

  // Filtering and sorting logic
  const filteredIssues = issueSummaries.filter(issue => {
    const matchesSearch = searchTerm === '' || 
      issue.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.userId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime()
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    return 0
  })

  const totalPages = Math.ceil(sortedIssues.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentIssues = sortedIssues.slice(startIndex, endIndex)

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Sorting handler
  const handleSort = (field: keyof IssueSummary) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setCurrentPage(1) // Reset to first page when sorting
  }

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
          <div className="flex items-center justify-between">
            <CardTitle>All Civic Issues</CardTitle>
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, sortedIssues.length)} of {sortedIssues.length} issues
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by issue type, location, or user..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page when searching
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value)
                  setCurrentPage(1) // Reset to first page when filtering
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th 
                    className="text-left py-2 font-medium cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('issueType')}
                  >
                    <div className="flex items-center gap-1">
                      Issue Type
                      {sortField === 'issueType' && (
                        <span className="text-blue-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left py-2 font-medium cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('location')}
                  >
                    <div className="flex items-center gap-1">
                      Location
                      {sortField === 'location' && (
                        <span className="text-blue-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left py-2 font-medium cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('userId')}
                  >
                    <div className="flex items-center gap-1">
                      User
                      {sortField === 'userId' && (
                        <span className="text-blue-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left py-2 font-medium cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </div>
                  </th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th className="text-left py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentIssues.map((issue, index) => (
                  <tr key={startIndex + index} className="border-b hover:bg-gray-50">
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
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1 text-sm border rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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
