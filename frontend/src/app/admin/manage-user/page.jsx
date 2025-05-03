import React from 'react'
import UserTable from '@/components/admin/UserTable';

export default function AdminManageUserPage() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <UserTable />
      </div>
    </main>
  );
}