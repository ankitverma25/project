import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, LogOut, Home, Gavel, BarChart2, FileText, Settings } from 'lucide-react';

const dealerLinks = [
  { href: '/dealer/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { href: '/dealer/bid-cars', label: 'Bid on Cars', icon: <Gavel size={18} /> },
  { href: '/dealer/my-bids', label: 'My Bids', icon: <BarChart2 size={18} /> },
  { href: '/dealer/documents', label: 'Documents', icon: <FileText size={18} /> },
  { href: '/dealer/settings', label: 'Settings', icon: <Settings size={18} /> },
];

export default function DealerNavbar() {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [dealerName, setDealerName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const dealer = JSON.parse(localStorage.getItem('dealer'));
        setDealerName(dealer?.name || 'Dealer');
        setAvatar(dealer?.avatar || '/avatar-placeholder.png');
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('dealer');
    localStorage.removeItem('token');
    window.location.href = '/dealer/login';
  };

  return (
    <nav className="w-full bg-white/90 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span className="text-emerald-700 font-extrabold text-2xl">REVIVO Dealer</span>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          {dealerLinks.map(link => (
            <Link key={link.href} href={link.href} className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 font-medium transition">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <div className="relative group">
            <img src={avatar} alt="Avatar" className="h-9 w-9 rounded-full border-2 border-emerald-600 cursor-pointer" />
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-50">
              <div className="px-4 py-2 text-gray-700 border-b">{dealerName}</div>
              <Link href="/dealer/settings" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50">Profile</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
            </div>
          </div>
        </div>
        <button className="md:hidden p-2 text-gray-700" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow px-4 pb-4 pt-2 flex flex-col gap-2">
          {dealerLinks.map(link => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium py-2">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <img src={avatar} alt="Avatar" className="h-8 w-8 rounded-full border-2 border-emerald-600" />
            <span className="text-gray-700 font-medium">{dealerName}</span>
          </div>
          <Link href="/dealer/settings" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50">Profile</Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
        </div>
      )}
    </nav>
  );
}
