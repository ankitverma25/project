'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronLeft, ChevronRight, LayoutDashboard, Gavel, ListChecks, Truck, FileCheck } from 'lucide-react';

const dealerLinks = [
  { href: '/dealer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dealer/bid-cars', label: 'Bid on Cars', icon: Gavel },
  { href: '/dealer/my-bids', label: 'My Bids', icon: ListChecks },
  { href: '/dealer/documents', label: 'Document Center', icon: FileCheck },
  { href: '/dealer/pickup', label: 'Pickup', icon: Truck },
];

export default function DealerSidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatar, setAvatar] = useState('/avatar-placeholder.png');
  const [dealerName, setDealerName] = useState('Dealer');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const dealer = JSON.parse(localStorage.getItem('dealer'));
        setDealerName(dealer?.name || 'Dealer');
        setAvatar(dealer?.avatar || '/avatar-placeholder.png');
      } catch {}
    }
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 top-0 left-0 h-screen bg-white border-r
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="h-16 border-b flex items-center justify-between px-4">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <img src={avatar} alt="" className="w-8 h-8 rounded-full" />
              <span className="font-medium truncate">{dealerName}</span>
            </div>
          )}
          
          {/* Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              hidden md:block p-1.5 rounded-lg hover:bg-gray-100
              ${collapsed ? 'ml-auto' : ''}
            `}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {dealerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg
                ${pathname === link.href 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
