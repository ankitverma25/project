// app/dealer/bids/page.js
import BidList from '@/components/dealer/BidList'

export default function BidsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bid Management</h1>
      <BidList />
    </div>
  )
}