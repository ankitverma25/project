'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLayout = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('admin_token');
            const admin = localStorage.getItem('admin');

            if (!token || !admin) {
                toast.error('Please login as admin to access this area');
                router.push('/admin_login');
                return;
            }

            try {
                const adminData = JSON.parse(admin);
                if (!adminData.isAdmin) {
                    toast.error('Unauthorized access');
                    router.push('/admin_login');
                    return;
                }
                setIsLoading(false);
            } catch (error) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin');
                toast.error('Session expired. Please login again');
                router.push('/admin_login');
            }
        };

        checkAuth();
    }, [router, pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                    <p className="mt-2 text-gray-600">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <div className="pt-2">
                <main className="container mx-auto px-4 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;