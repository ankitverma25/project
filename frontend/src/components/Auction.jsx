import Link from 'next/link'
import React from 'react'

const Auction = () => {
    
  return (
    <div className="bg-green-300 py-16">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">
        Featured Auctions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-green-100 rounded-lg shadow-2xl shadow-green-700 overflow-hidden border-green-700 border-2"
          >
            <div className="relative h-48">
              <img
                src={`/alto.jpeg`}
                className="w-full h-full object-cover"
                alt="Auction Item"
              />
              <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm">
                Active
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                2022 Tesla Model 3
              </h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Current Bid</span>
                <span className="text-emerald-600 font-semibold">
                  $12,500
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Time Left</span>
                <span className="text-red-600">2h 15m</span>
              </div>
              <Link href='/dealer_login'>
              <button className="mx-auto p-2 rounded-2xl py-2 bg-gray-100 text-gray-700 !rounded-button hover:bg-gray-200 cursor-pointer">
                Login to Bid
              </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
   )
}

export default Auction