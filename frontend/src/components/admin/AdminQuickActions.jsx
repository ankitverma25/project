'use client';
import { useRouter } from 'next/navigation';

export default function AdminQuickActions() {
  const router = useRouter();
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <button
        className="bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        onClick={() => router.push('/admin/manage-dealer')}
      >
        Approve Dealers
      </button>
      <button
        className="bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        onClick={() => router.push('/admin/manage-user')}
      >
        Manage Users
      </button>
      <button
        className="bg-amber-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
        onClick={() => router.push('/admin/reports')}
      >
        View Reports
      </button>
    </div>
  );
}