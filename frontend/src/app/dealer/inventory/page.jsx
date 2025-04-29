// app/dealer/inventory/page.js
import InventoryManager from '@/components/dealer/InventoryManager'

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory Management</h1>
      <InventoryManager />
    </div>
  )
}