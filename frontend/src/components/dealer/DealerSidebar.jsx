// components/dealer/DealerSidebar.js
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  X, LayoutDashboard, HandCoins, Warehouse, 
  History, LineChart, Settings 
} from 'lucide-react'

export default function DealerSidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname()
  
  const navItems = [
    { path: '/dealer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dealer/bids', icon: HandCoins, label: 'Bid Management' },
    { path: '/dealer/inventory', icon: Warehouse, label: 'Inventory' },
    { path: '/dealer/transactions', icon: History, label: 'Transactions' },
    { path: '/dealer/analytics', icon: LineChart, label: 'Analytics' },
    { path: '/dealer/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className={`fixed inset-y-0 z-50 lg:static lg:block 
      ${sidebarOpen ? 'w-64' : '-translate-x-full lg:translate-x-0'} 
      transition-transform duration-200 ease-in-out bg-white border-r`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <img src="/dealer-logo.png" className="h-8 w-8" />
          <span className="ml-2 text-xl font-semibold">ScrapDealer Pro</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium 
                ${isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : ''}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}