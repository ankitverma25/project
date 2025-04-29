// components/dealer/InventoryOverview.js
import { Progress } from '@/components/ui/progress'

export default function InventoryOverview() {
  const inventory = [
    { material: 'Steel', quantity: 450, target: 1000 },
    { material: 'Aluminum', quantity: 180, target: 500 },
    { material: 'Copper', quantity: 75, target: 200 },
    { material: 'Plastic', quantity: 320, target: 800 }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Inventory Overview</h3>
        <span className="text-sm text-gray-500">Monthly Target</span>
      </div>

      <div className="space-y-4">
        {inventory.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item.material}</span>
              <span>{item.quantity}/{item.target} kg</span>
            </div>
            // src/components/dealer/InventoryOverview.js
<Progress 
  value={(item.quantity / item.target) * 100} 
  className="h-2"
  indicatorcolor={
    (item.quantity / item.target) * 100 > 75 ? 'bg-green-500' :
    (item.quantity / item.target) * 100 > 50 ? 'bg-amber-500' : 'bg-red-500'
  }
/>
          </div>
        ))}
      </div>
    </div>
  )
}