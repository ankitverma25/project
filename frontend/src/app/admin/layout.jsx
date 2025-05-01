import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/app/Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar userType="admin" />
            <div className="flex-1 flex flex-col">
                <Navbar userType="admin" />
                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;