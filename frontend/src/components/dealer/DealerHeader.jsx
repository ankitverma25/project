// components/dealer/DealerHeader.js
'use client'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DealerHeader() {
  const [dealerName, setDealerName] = useState('');
  const [avatar, setAvatar] = useState('/avatar-placeholder.png');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const dealer = JSON.parse(localStorage.getItem('dealer'));
        setDealerName(dealer?.name || 'Dealer');
        setAvatar(dealer?.avatar || '/avatar-placeholder.png');
      } catch {}
    }
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome, {dealerName}
        </h1>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-blue-600 relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center">
            <img 
              src={avatar}
              className="h-10 w-10 rounded-full border-2 border-blue-500"
              alt="Dealer Avatar"
            />
          </div>
        </div>
      </div>
    </header>
  )
}