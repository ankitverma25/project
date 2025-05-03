// app/dealer/transactions/page.js
import TransactionHistory from '@/components/dealer/TransactionHistory'

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transaction History</h1>
      <TransactionHistory />
    </div>
  )
}