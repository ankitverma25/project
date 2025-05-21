// app/dealer/dashboard/page.js
'use client'

import React, { useEffect, useState } from 'react'
import { User, Bell } from 'lucide-react'
import StatsGrid from '@/components/dealer/StatsGrid'
import ActiveBids from '@/components/dealer/ActiveBids'

export default function DealerDashboard() {
  const [dealerName, setDealerName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const dealer = JSON.parse(localStorage.getItem('dealer'));
        setDealerName(dealer?.name || 'Dealer');
      } catch {}
    }
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {dealerName}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your bids today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-600 hover:text-blue-600 relative bg-white rounded-full shadow-sm">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Profile</span>
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <StatsGrid />

      {/* Active Bids Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ActiveBids />
      </div>
    </div>
  )
}