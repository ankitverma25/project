export default function AdminUserDetailPage({ params }) {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">User Details: {params.userId}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* User detail and edit form will go here */}
        <p className="text-gray-600">View and edit user details here.</p>
      </div>
    </main>
  );
}