// src/components/dealer/StatsGrid.js
import { IndianRupee, Package, Clock, TrendingUp } from 'lucide-react'

export default function StatsGrid() {
  const stats = [
    { 
      title: "Total Revenue", 
      value: "₹2,45,800", 
      icon: <IndianRupee className="h-6 w-6" />,
      change: "+12.5% from last month"
    },
    { 
      title: "Active Inventory", 
      value: "1,250 kg", 
      icon: <Package className="h-6 w-6" />,
      change: "+200 kg this week"
    },
    { 
      title: "Pending Bids", 
      value: "15", 
      icon: <Clock className="h-6 w-6" />,
      change: "3 new today"
    },
    { 
      title: "Monthly Growth", 
      value: "+18.2%", 
      icon: <TrendingUp className="h-6 w-6" />,
      change: "Better than average"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              <p className="text-xs text-green-600 mt-2">{stat.change}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}