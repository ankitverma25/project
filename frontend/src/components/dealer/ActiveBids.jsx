// components/dealer/ActiveBids.js
'use client'
import { useState, useEffect } from 'react'
import { Car, Calendar, IndianRupee, CheckCircle, XCircle, Loader2, AlertTriangle, Clock } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function ActiveBids() {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchBids()
  }, [])

  const fetchBids = async () => {
    try {
      const dealerToken = localStorage.getItem('dealerToken')
      const dealer = JSON.parse(localStorage.getItem('dealer'))

      if (!dealerToken || !dealer) {
        router.push('/dealer_login')
        return
      }

      const response = await axios.get('http://localhost:8000/bid/all', {
        headers: { 
          'Authorization': `Bearer ${dealerToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.data) {
        throw new Error('No data received from server')
      }

      // Get only this dealer's PENDING bids (not accepted)
      const pendingBids = response.data
        .filter(bid => 
          bid.dealer && 
          bid.dealer._id === dealer._id && 
          !bid.isAccepted // Only get bids that aren't accepted
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5) // Show only latest 5 bids

      setBids(pendingBids)
      setError(null)
    } catch (err) {
      console.error('Bid fetch error:', err)
      if (err.response?.status === 401) {
        localStorage.removeItem('dealerToken')
        localStorage.removeItem('dealer')
        router.push('/dealer_login')
        return
      }
      setError('Failed to load bids. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600">Loading your bids...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-100">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 font-medium">Oops! Something went wrong</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={fetchBids}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Car className="w-5 h-5 text-blue-600" />
          Recent Bids
        </h2>
        <Link
          href="/dealer/my-bids"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          View All <span aria-hidden="true">→</span>
        </Link>
      </div>

      {bids.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-700 font-medium text-lg">No Active Bids Yet</h3>
          <p className="text-gray-500 text-sm mt-2 mb-6 max-w-sm mx-auto">
            Ready to get started? Browse available cars and place your first bid.
          </p>
          <Link
            href="/dealer/bid-cars"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow"
          >
            Browse Available Cars
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bids.map((bid) => (
            <div 
              key={bid._id} 
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      {bid.car.model} 
                      <span className="text-sm text-gray-500">({bid.car.year})</span>
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <span className="inline-flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        {bid.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="inline-flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(bid.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${bid.isAccepted
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}
                  >
                    {bid.isAccepted ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accepted
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-1" />
                        Pending
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}