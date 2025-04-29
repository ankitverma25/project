// components/dealer/ActiveBids.js
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ActiveBids() {
  const bids = [
    { id: 1, vehicle: 'Maruti Swift Dzire', amount: '₹25,000', status: 'Pending', daysLeft: 2 },
    { id: 2, vehicle: 'Honda City i-VTEC', amount: '₹38,500', status: 'Accepted', daysLeft: 5 },
    { id: 3, vehicle: 'Hyundai i20 Asta', amount: '₹18,200', status: 'Expired', daysLeft: 0 }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-100 text-amber-800'
      case 'Accepted': return 'bg-green-100 text-green-800'
      case 'Expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Active Bids</h3>
        <Link href="/dealer/bids">
          <Button variant="outline">View All</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Bid Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bids.map((bid) => (
              <TableRow key={bid.id}>
                <TableCell className="font-medium">{bid.vehicle}</TableCell>
                <TableCell>{bid.amount}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(bid.status)}`}>
                    {bid.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    {bid.status === 'Pending' ? 'Modify' : 'View'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}