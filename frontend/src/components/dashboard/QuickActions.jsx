'use client'

import { Plus, History, Download } from 'lucide-react'
import Link from 'next/link'

const QuickActions = () => {
  const actions = [
    { path:'/user/new-request', icon: Plus, title: 'New Request', desc: 'Scrap your old vehicle', bg: 'bg-green-100', color: 'text-green-600' },
    { path:'', icon: History, title: 'Past Transactions', desc: 'View your history', bg: 'bg-blue-100', color: 'text-blue-600' },
    { path:'', icon: Download, title: 'Download Certificate', desc: 'Get your scrap certificates', bg: 'bg-amber-100', color: 'text-amber-600' }
  ]

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map(({ icon: Icon, title, desc, bg, color,path }, index) => (
          <button key={index} className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-md">
            <div className={`${bg} rounded-full p-4 mb-3`}>
              <Link href={path} className="flex flex-col items-center text-center">
              <Icon className={`text-2xl ${color}`} /></Link>
            </div>
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-gray-500 text-sm text-center mt-1">{desc}</p>
          </button>
        ))}
      </div>
    </section>
  )
}

export default QuickActions