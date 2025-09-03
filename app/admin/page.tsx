"use client"

import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage civic issues and view community analytics
          </p>
        </div>

        {/* Analytics Dashboard */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 relative overflow-hidden">
          {/* New Feature Banner */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              ✨ NEW FEATURE
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              📊 Community Analytics Dashboard
            </h2>
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm font-medium animate-bounce">
              🎉 Just Launched!
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800 font-medium">
                  🚀 <strong>Brand New:</strong> Real-time community insights powered by GitHub Issues database! 
                  Track civic issues, analyze trends, and monitor community impact - all automatically updated every 6 hours.
                </p>
              </div>
            </div>
          </div>
          
          <AnalyticsDashboard />
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🚨 Civic Issues Management
            </h3>
            <p className="text-gray-600 mb-4">
              View and manage all reported civic issues
            </p>
            <a
              href="https://github.com/ScienceArtist/civic-issues-database/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Issues
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📈 Analytics Repository
            </h3>
            <p className="text-gray-600 mb-4">
              Access detailed analytics and reports
            </p>
            <a
              href="https://github.com/ScienceArtist/civic-issues-database/tree/main/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              View Analytics
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ⚙️ System Status
            </h3>
            <p className="text-gray-600 mb-4">
              Monitor GitHub Actions and automation
            </p>
            <a
              href="https://github.com/ScienceArtist/civic-issues-database/actions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Check Status
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
