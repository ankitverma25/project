'use client'

import { useEffect, useState } from 'react'
import { Eye, Check, FileText, Calendar as CalendarIcon, Star, ChevronRight } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const ActiveRequests = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchActiveCars()
  }, [])

  const fetchActiveCars = async () => {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))

      if (!token || !user) {
        router.push('/login')
        return
      }

      const response = await axios.get('http://localhost:8000/car/allCars', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data) {
        // Filter cars that belong to the user and are active (open for bids)
        const activeCars = response.data.filter(car => 
          car.owner && 
          car.owner._id === user._id && 
          car.status !== 'closed' && 
          !car.isSold
        )

        // For each car, fetch its bids
        const carsWithBids = await Promise.all(activeCars.map(async car => {
          const bidsRes = await axios.get(`http://localhost:8000/bid/car/${car._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          return {
            ...car,
            totalBids: bidsRes.data.length,
            highestBid: Math.max(...bidsRes.data.map(bid => bid.amount), 0)
          }
        }))

        setCars(carsWithBids)
      }
    } catch (err) {
      console.error('Error fetching cars:', err)
      setError('Failed to load active requests')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (condition) => {
    let rating = 0
    switch(condition?.toLowerCase()) {
      case 'excellent': rating = 5; break;
      case 'good': rating = 4; break;
      case 'fair': rating = 3; break;
      case 'poor': rating = 2; break;
      default: rating = 1;
    }
    
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading active requests...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  if (cars.length === 0) {
    return (
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Scrap Requests</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No active scrap requests found</p>
          <Link href="/user/new-request" className="text-blue-600 hover:underline">
            Create New Request
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Scrap Requests</h2>
        <Link 
          href="/user/bids" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <span>View All</span>
          <ChevronRight className="ml-1 w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cars.map((car) => (
          <div key={car._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{car.model} ({car.year})</h3>
                  <p className="text-gray-500">VIN: {car.vehicleNumber}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {car.totalBids} Bids
                </span>
              </div>
              
              <div className="mt-4 flex items-center">
                <img 
                  src={car.photos?.[0] || "/car-placeholder.jpg"} 
                  alt={car.model} 
                  className="w-24 h-16 rounded object-cover object-center"
                />
                <div className="ml-4">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-green-700">
                      ₹{car.highestBid.toLocaleString('en-IN')}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      Highest Bid
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {renderStars(car.condition)}
                    </div>
                    <span className="ml-1 text-xs text-gray-500">Condition</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href={`/user/bids?carId=${car._id}`}
                  className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Bids
                </Link>
                <button
                  onClick={() => router.push('/user/documents?carId=' + car._id)}
                  className="py-2 px-4 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center justify-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Documents
                </button>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Created: {new Date(car.createdAt).toLocaleDateString()}
                </span>
                <span className="text-gray-500">
                  Location: {car.address?.city || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ActiveRequests