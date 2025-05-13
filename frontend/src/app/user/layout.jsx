'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Toaster } from 'react-hot-toast'

export default function UserLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar Area */}
        <div className={`fixed h-full z-20 transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <Sidebar 
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {/* Header */}
          <div className="sticky top-0 z-10 h-16">
            <Header />
          </div>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-auto p-2">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}