'use client'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isClient, setIsClient] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [dropdown, setDropdown] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const u = JSON.parse(localStorage.getItem('user'))
      setUser(u)
    }
  }, [])

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
            
              
             
            </div>

            <div className="flex items-center space-x-2 relative">
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setDropdown((d) => !d)}
              >
                <img
                  src={isClient && user?.avatar && user.avatar.startsWith('http') ? user.avatar : '/avatar-placeholder.png'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <span className="font-medium text-gray-700">{isClient && user?.name ? user.name : 'User'}</span>
                <ChevronDown className="text-gray-500 w-4 h-4" />
              </button>
              {dropdown && (
                <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded shadow-lg z-50 border">
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