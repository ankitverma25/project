// components/dealer/QuickActions.js
'use client'
import { HandCoins, Package, FileText, Calendar } from 'lucide-react'

export default function QuickActions() {
  const actions = [
    {
      title: "Create New Bid",
      icon: <HandCoins className="w-6 h-6" />,
      color: "bg-blue-100",
      link: "/dealer/bids/new"
    },
    {
      title: "Add Inventory",
      icon: <Package className="w-6 h-6" />,
      color: "bg-green-100",
      link: "/dealer/inventory/add"
    },
    {
      title: "Generate Report",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-purple-100",
      link: "/reports"
    },
    {
      title: "View Schedule",
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-amber-100",
      link: "/schedule"
    }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.link}
            className={`${action.color} p-4 rounded-lg flex flex-col items-center justify-center hover:opacity-90 transition-opacity`}
          >
            <div className="mb-2">{action.icon}</div>
            <span className="text-sm text-center font-medium">{action.title}</span>
          </a>
        ))}
      </div>
    </div>
  )
}