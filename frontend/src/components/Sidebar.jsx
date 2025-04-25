'use client'
import { Home, Car, Coins, Calendar, Scale, Leaf, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar({ isCollapsed, toggleCollapse }) {
  const pathname = usePathname()
  
  const navItems = [
    { path: '/user/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/user/new-request', icon: Car, label: 'New Request' },
    { path: '/user/bids', icon: Coins, label: 'Bids' },
    { path: '/user/pickup', icon: Calendar, label: 'Pickup' },
    { path: '/user/legal', icon: Scale, label: 'Legal' },
    { path: '/user/eco-impact', icon: Leaf, label: 'Eco Impact' }
  ]

  return (
    <div className="h-full bg-white shadow-lg flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 sm:px-6 lg:px-8 border-b flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center">
            <span className="ml-2 text-xl font-bold text-green-800">REVIVO</span>
          </div>
        )}
        <img src="/logo.jpg" alt="Logo" className="h-8 w-8 border-2 border-green-700 rounded-full " />
        <button 
          onClick={toggleCollapse}
          className="text-gray-500 hover:text-gray-700"
        >
          {isCollapsed ? <ChevronRight size={30} className='font-bold'/> : <ChevronLeft size={30} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <Link
                href={path}
                className={`flex items-center p-3 rounded-lg ${
                  pathname === path 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}