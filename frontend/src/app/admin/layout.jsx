import React from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex bg-gray-50">
            <div className="flex-1 flex flex-col">
                <div className="h-16"><AdminNavbar /></div>
                <main className="flex-1 p-4 md:p-6 pt-20">{/* pt-20 for navbar space */}
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;