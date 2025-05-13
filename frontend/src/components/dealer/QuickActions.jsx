// components/dealer/QuickActions.js
'use client'
import { HandCoins, FileText, Calendar, FileArchive } from 'lucide-react'
import Link from 'next/link'

export default function QuickActions() {
  const actions = [
    {
      title: "Create New Bid",
      icon: <HandCoins className="w-6 h-6" />,
      color: "bg-blue-100",
      link: "/dealer/bids/new"
    },
    {
      title: "View Documents",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-green-100",
      link: "/dealer/documents"
    },
    {
      title: "Upload Documents",
      icon: <FileArchive className="w-6 h-6" />,
      color: "bg-purple-100",
      link: "/dealer/documents/upload"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link href={action.link} key={index}>
            <div className={`${action.color} p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-3">
                {action.icon}
                <span className="font-medium">{action.title}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}