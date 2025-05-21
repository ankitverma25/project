// app/dealer/layout.js
'use client'
import { useState } from 'react';
import DealerSidebar from '@/components/DealerSidebar';

export default function DealerLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DealerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Main Content Area */}
      <main 
        className={`
          flex-1 min-h-screen transition-all duration-300 ease-in-out
          ${collapsed ? 'md:ml-20' : 'md:ml-64'}
        `}
      >
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}