'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, Users, BarChart2, FileText, LogOut, Home } from 'lucide-react';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { href: '/admin/manage-dealer', label: 'Manage Dealers', icon: <Users size={18} /> },
  { href: '/admin/manage-user', label: 'Manage Users', icon: <User size={18} /> },
  { href: '/admin/reports', label: 'Reports', icon: <BarChart2 size={18} /> },
  { href: '/admin/profile', label: 'Profile', icon: <FileText size={18} /> },
];

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white/90 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span className="text-emerald-700 font-extrabold text-2xl">REVIVO Admin</span>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          {adminLinks.map(link => (
            <Link key={link.href} href={link.href} className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 font-medium transition">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <button className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
        <button className="md:hidden p-2 text-gray-700" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow px-4 pb-4 pt-2 flex flex-col gap-2">
          {adminLinks.map(link => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium py-2">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <button className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium py-2">
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
