'use client';
export default function AdminStatsGrid() {
  // Placeholder stats
  const stats = [
    { label: 'Total Users', value: 1200 },
    { label: 'Total Dealers', value: 45 },
    { label: 'Cars Recycled', value: 320 },
    { label: 'Pending Dealers', value: 3 },
  ];
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map(stat => (
        <div key={stat.label} className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
          <div className="text-gray-600 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}