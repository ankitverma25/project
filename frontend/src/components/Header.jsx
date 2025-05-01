'use client'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null
  const [showNotifications, setShowNotifications] = useState(false)
  const [dropdown, setDropdown] = useState(false)

  const getTitle = () => {
    const route = pathname.split('/').pop()
    const titles = {
      dashboard: 'Dashboard',
      'new-request': 'New Scrap Request',
      bids: 'Bids',
      pickup: 'Pickup Schedule',
      legal: 'Legal Documents',
      'eco-impact': 'Eco Impact'
    }
    return titles[route] || 'Dashboard'
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-lg font-semibold text-gray-900">{getTitle()}</h1>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <button 
                className="relative p-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
            </div>

            <div className="flex items-center space-x-2 relative">
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setDropdown((d) => !d)}
              >
                <img
                  src={user?.avatar || '/avatar-placeholder.png'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <span className="font-medium text-gray-700">{user?.name || 'User'}</span>
                <ChevronDown className="text-gray-500 w-4 h-4" />
              </button>
              {dropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50 border">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => { setDropdown(false); router.push('/user/settings'); }}
                  >
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      setDropdown(false);
                      router.push('/');
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}