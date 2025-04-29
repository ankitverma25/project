// components/dealer/DealerMobileHeader.js
'use client'
import { Menu } from 'lucide-react'

export default function DealerMobileHeader({ setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-40 flex items-center px-4 py-3 bg-white border-b lg:hidden">
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="text-gray-500 hover:text-gray-600"
      >
        <Menu className="h-6 w-6" />
      </button>
      <div className="ml-4">
        <h1 className="text-lg font-medium">Dealer Dashboard</h1>
      </div>
    </header>
  )
}