// components/dealer/TransactionHistory.js
'use client'
export default function TransactionHistory() {
  const transactions = [
    { id: 1, date: '2024-03-15', amount: 25000, type: 'Credit', status: 'Completed' },
    { id: 2, date: '2024-03-14', amount: 32000, type: 'Credit', status: 'Pending' }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td className="px-6 py-4">{new Date(txn.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">₹{txn.amount.toLocaleString()}</td>
                <td className="px-6 py-4">{txn.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    txn.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}