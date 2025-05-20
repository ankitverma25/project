'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, User, Users, BarChart2, FileText, LogOut, Home, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { href: '/admin/manage-dealer', label: 'Dealers', icon: <Users size={18} /> },
  { href: '/admin/manage-user', label: 'Users', icon: <User size={18} /> },
  { href: '/admin/reports', label: 'Reports', icon: <BarChart2 size={18} /> },
];

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (admin) {
      const { name } = JSON.parse(admin);
      setAdminName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
    toast.success('Logged out successfully');
    router.push('/admin_login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-emerald-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Revivo Admin</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Link>
              ))}

              {/* Admin Profile and Logout */}
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="block font-medium text-gray-900">{adminName}</span>
                  <span className="block text-xs">Administrator</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="ml-2">Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
