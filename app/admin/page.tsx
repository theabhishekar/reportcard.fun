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
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            📊 Community Analytics Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            Real-time insights from community civic issue reports
          </p>
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
