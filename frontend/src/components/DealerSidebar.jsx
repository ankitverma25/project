import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronLeft, ChevronRight, LayoutDashboard, Gavel, ListChecks, FileText, BarChart2, Settings, Truck } from 'lucide-react';

const dealerLinks = [
  { href: '/dealer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dealer/bid-cars', label: 'Bid on Cars', icon: Gavel },
  { href: '/dealer/my-bids', label: 'My Bids', icon: ListChecks },
  { href: '/dealer/documents', label: 'Documents', icon: FileText },
  { href: '/dealer/pickup', label: 'pickup', icon: Truck },
  { href: '/dealer/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dealer/settings', label: 'Settings', icon: Settings },
];

export default function DealerSidebar() {
  const pathname = usePathname();
  const [avatar, setAvatar] = useState('/avatar-placeholder.png');
  const [dealerName, setDealerName] = useState('Dealer');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const dealer = JSON.parse(localStorage.getItem('dealer'));
        setDealerName(dealer?.name || 'Dealer');
        setAvatar(dealer?.avatar || '/avatar-placeholder.png');
      } catch {}
    }
  }, []);

  // Responsive: close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow border border-emerald-100"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={28} />
      </button>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setMobileOpen(false)} />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 top-0 left-0 h-screen bg-white shadow-lg flex flex-col transition-all duration-300
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
        style={{ minHeight: '100vh' }}
      >
        <div className={`p-4 border-b flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex flex-col items-center w-full">
              <img src={avatar} alt="Avatar" className="h-12 w-12 rounded-full border-2 border-emerald-600 mb-1" />
              <span className="text-base font-bold text-green-800">{dealerName}</span>
              <span className="text-xs text-gray-500">Dealer Panel</span>
            </div>
          )}
          {collapsed && (
            <img src={avatar} alt="Avatar" className="h-10 w-10 rounded-full border-2 border-emerald-600" />
          )}
          {/* Collapse/Expand Button */}
          <button
            className="absolute top-4 right-2 md:block hidden text-gray-500 hover:text-emerald-700"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
          {/* Mobile close button */}
          <button
            className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-emerald-700"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={28} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto mt-4">
          <ul className="space-y-1 p-2">
            {dealerLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition whitespace-nowrap
                    ${pathname === link.href ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-emerald-100'}
                    ${collapsed ? 'justify-center px-2' : ''}
                  `}
                  title={collapsed ? link.label : undefined}
                >
                  <link.icon className="w-5 h-5" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
