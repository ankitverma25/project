import Link from 'next/link';
import { Home, Car, Coins, Calendar, Scale, Leaf } from 'lucide-react';

const userLinks = [
  { href: '/user/dashboard', label: 'Dashboard', icon: Home },
  { href: '/user/new-request', label: 'New Request', icon: Car },
  { href: '/user/bids', label: 'Bids', icon: Coins },
  { href: '/user/pickup', label: 'Pickup', icon: Calendar },
  { href: '/user/legal', label: 'Legal', icon: Scale },
  { href: '/user/eco-impact', label: 'Eco Impact', icon: Leaf },
  { href: '/user/settings', label: 'Settings' },
];

export default function UserSidebar() {
  return (
    <aside className="h-full w-64 bg-white shadow-lg flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <span className="text-xl font-bold text-green-800">User Panel</span>
        <img src="/logo.jpg" alt="Logo" className="h-8 w-8 border-2 border-green-700 rounded-full" />
      </div>
      <nav className="flex-1 overflow-y-auto mt-4">
        <ul className="space-y-1 p-2">
          {userLinks.map(link => (
            <li key={link.href}>
              <Link href={link.href} className="block px-4 py-2 rounded hover:bg-emerald-100 text-gray-700 font-medium transition flex items-center gap-2">
                {link.icon && <link.icon className="w-5 h-5" />} {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
