export default function AdminQuickActions() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <button className="bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Approve Dealers</button>
      <button className="bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition">Manage Users</button>
      <button className="bg-amber-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-amber-600 transition">View Reports</button>
    </div>
  );
}