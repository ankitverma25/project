// components/dealer/InventoryManager.js
'use client'
import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import InventoryForm from './InventoryForm'

export default function InventoryManager() {
  const [showForm, setShowForm] = useState(false)
  const inventory = [
    { id: 1, type: 'Steel', weight: 450, purity: 95, location: 'Warehouse A' },
    { id: 2, type: 'Aluminum', weight: 120, purity: 98, location: 'Warehouse B' }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">{item.type}</h3>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {item.purity}% purity
              </span>
            </div>
            <div className="mt-2">
              <p className="text-gray-600">{item.weight} kg</p>
              <p className="text-sm text-gray-500 mt-2">{item.location}</p>
            </div>
          </div>
        ))}
      </div>

      {showForm && <InventoryForm onClose={() => setShowForm(false)} />}
    </div>
  )
}