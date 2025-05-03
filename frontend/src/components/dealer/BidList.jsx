// components/dealer/BidList.js
'use client'
import { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import CreateBidModal from './CreateBidModal'

export default function BidList() {
  const [showModal, setShowModal] = useState(false)
  const bids = [
    { id: 1, vehicle: 'Swift Dzire', amount: 25000, status: 'Pending', date: '2024-03-15' },
    { id: 2, vehicle: 'Honda City', amount: 32000, status: 'Accepted', date: '2024-03-14' }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search bids..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 border rounded-md">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Bid
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Vehicle</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Bid Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bids.map((bid) => (
              <tr key={bid.id}>
                <td className="px-6 py-4">{bid.vehicle}</td>
                <td className="px-6 py-4">₹{bid.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    bid.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    bid.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100'
                  }`}>
                    {bid.status}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(bid.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <CreateBidModal onClose={() => setShowModal(false)} />}
    </div>
  )
}