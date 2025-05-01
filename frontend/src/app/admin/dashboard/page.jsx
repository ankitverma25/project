import AdminQuickActions from '@/components/admin/AdminQuickActions';
import AdminStatsGrid from '@/components/admin/AdminStatsGrid';
import PendingDealerApprovals from '@/components/admin/PendingDealerApprovals';
import AdminActivitySummary from '@/components/admin/AdminActivitySummary';

export default function AdminDashboardPage() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <AdminQuickActions />
      <AdminStatsGrid />
      <PendingDealerApprovals />
      <AdminActivitySummary />
    </main>
  );
}
