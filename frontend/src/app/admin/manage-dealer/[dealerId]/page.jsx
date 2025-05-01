export default function AdminDealerDetailPage({ params }) {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dealer Details: {params.dealerId}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Dealer detail and approval form will go here */}
        <p className="text-gray-600">View, approve, or reject dealer here.</p>
      </div>
    </main>
  );
}