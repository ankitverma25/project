'use client'

import { Eye, Check, FileText, Calendar as CalendarIcon, Star,ChevronRight } from 'lucide-react'

const ActiveRequests = () => {
  const requests = [
    {
      id: 'SR-2025-0412',
      model: 'Swift Dzire 2015',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-800',
      image: '/swift-dzire.jpg',
      price: '₹25,000',
      rating: 3.5,
      date: '15 Apr 2025',
      bids: 4
    },
    {
      id: 'SR-2025-0405',
      model: 'Honda City 2012',
      status: 'Accepted',
      statusColor: 'bg-green-100 text-green-800',
      image: '/honda-city.jpg',
      price: '₹32,000',
      rating: 4,
      date: '5 Apr 2025',
      pickup: '20 Apr 2025'
    }
  ]

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      i < Math.floor(rating) ? (
        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
      ) : (
        <Star key={i} className="w-4 h-4 text-amber-400" />
      )
    ))
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Scrap Requests</h2>
        <button className="text-blue-600 hover:text-blue-800 flex items-center">
          <span>View All</span>
          <ChevronRight className="ml-1 w-3 h-3" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((request, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{request.model}</h3>
                  <p className="text-gray-500">Request ID: {request.id}</p>
                </div>
                <span className={`px-3 py-1 ${request.statusColor} rounded-full text-sm`}>
                  {request.status}
                </span>
              </div>
              
              <div className="mt-4 flex items-center">
                <img src={request.image} alt={request.model} className="w-24 h-16 rounded object-cover object-top" />
                <div className="ml-4">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-green-700">{request.price}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {request.status === 'Pending' ? 'Highest Bid' : 'Accepted Bid'}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {renderStars(request.rating)}
                    </div>
                    <span className="ml-1 text-xs text-gray-500">Condition</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                {request.status === 'Pending' ? (
                  <>
                    <button className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
                      <Eye className="w-4 h-4 mr-2" />
                      View Bids
                    </button>
                    <button className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center">
                      <Check className="w-4 h-4 mr-2" />
                      Accept Offer
                    </button>
                  </>
                ) : (
                  <>
                    <button className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button className="py-2 px-4 bg-amber-600 text-white rounded hover:bg-amber-700 flex items-center justify-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Schedule Pickup
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Submitted: {request.date}</span>
                <span className="text-gray-500">
                  {request.bids ? `Bids: ${request.bids}` : `Pickup: ${request.pickup}`}
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