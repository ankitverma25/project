import DealerTable from '@/components/admin/DealerTable';

export default function AdminManageDealerPage() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Dealers</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <DealerTable />
      </div>
    </main>
  );
}