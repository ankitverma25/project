// components/dealer/DealerHeader.js
'use client'
import { Bell, Search } from 'lucide-react'

export default function DealerHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-blue-600">
            <Bell className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <img 
              src="/dealer-avatar.png" 
              className="h-10 w-10 rounded-full border-2 border-blue-500"
              alt="Dealer Avatar"
            />
          </div>
        </div>
      </div>
    </header>
  )
}