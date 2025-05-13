// components/dealer/StatsGrid.js
'use client'
import React from 'react'

import { IndianRupee, FileText, Clock, TrendingUp } from 'lucide-react'

export default function StatsGrid() {
  const stats = [
    { 
      title: "Total Revenue", 
      value: "₹2,45,800", 
      icon: <IndianRupee className="h-6 w-6" />,
      change: "+12.5% from last month"
    },
    { 
      title: "Documents", 
      value: "15", 
      icon: <FileText className="h-6 w-6" />,
      change: "3 new this week"
    },
    { 
      title: "Pending Bids", 
      value: "8", 
      icon: <Clock className="h-6 w-6" />,
      change: "2 new today"
    },
    { 
      title: "Monthly Growth", 
      value: "+18.2%", 
      icon: <TrendingUp className="h-6 w-6" />,
      change: "Better than average"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              {stat.icon}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{stat.change}</p>
        </div>
      ))}
    </div>
  )
}