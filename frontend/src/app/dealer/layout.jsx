// app/dealer/layout.js
'use client'
import { useState } from 'react'
import DealerSidebar from '@/components/dealer/DealerSidebar'
import DealerMobileHeader from '@/components/dealer/DealerMobileHeader'

export default function DealerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <DealerSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      {/* Mobile Header */}
      <DealerMobileHeader setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}