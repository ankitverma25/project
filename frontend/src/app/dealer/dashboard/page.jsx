// app/dealer/dashboard/page.js
'use client'

import React from 'react' 
import StatsGrid from '@/components/dealer/StatsGrid'
import QuickActions from '@/components/dealer/QuickActions'
import ActiveBids from '@/components/dealer/ActiveBids'

export default function DealerDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <StatsGrid />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content */}
      <div className="bg-white p-6 rounded-lg shadow">
        <ActiveBids />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        {/* Transaction Table Component */}
      </div>
    </div>
  )
}