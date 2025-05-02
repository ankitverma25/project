// app/dealer/layout.js
'use client'
import { useState } from 'react';
import DealerSidebar from '@/components/DealerSidebar';

export default function DealerLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <DealerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={"transition-all duration-300 " + (collapsed ? "md:ml-20" : "md:ml-64")}> 
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}