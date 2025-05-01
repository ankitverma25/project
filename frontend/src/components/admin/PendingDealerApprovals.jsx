export default function PendingDealerApprovals() {
  // Placeholder data
  const pendingDealers = [
    { id: 1, name: 'AutoScrapX', email: 'dealer1@email.com', business: 'AutoScrapX Pvt Ltd' },
    { id: 2, name: 'Green Recycle', email: 'dealer2@email.com', business: 'Green Recycle LLP' },
  ];
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">Pending Dealer Approvals</h2>
      <ul>
        {pendingDealers.map(dealer => (
          <li key={dealer.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
            <div>
              <div className="font-semibold">{dealer.name}</div>
              <div className="text-xs text-gray-500">{dealer.email} &bull; {dealer.business}</div>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs">Approve</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}