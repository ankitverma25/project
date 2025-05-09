'use client'

import { Eye, Check, FileText, Calendar as CalendarIcon, Star, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

const ActiveRequests = () => {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let userId = '';
    let token = '';
    if (typeof window !== 'undefined') {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        userId = user?._id || '';
        token = localStorage.getItem('token') || '';
      } catch {}
    }

    if (!userId || !token) {
      setError('User not found or not logged in');
      setLoading(false);
      return;
    }

    // Fetch user's cars with their bids
    axios.get('http://localhost:8000/car/allCars', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        const userCars = res.data.filter(car => car.owner && (car.owner._id === userId || car.owner === userId));
        
        // Fetch bids for each car
        const carsWithBids = await Promise.all(
          userCars.map(async (car) => {
            try {
              const bidRes = await axios.get(`http://localhost:8000/bid/car/${car._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              return {
                ...car,
                bids: bidRes.data,
                highestBid: bidRes.data.length > 0 ? 
                  Math.max(...bidRes.data.map(bid => bid.amount)) : 0
              };
            } catch {
              return { ...car, bids: [], highestBid: 0 };
            }
          })
        );

        // Sort by date, newest first
        const sortedRequests = carsWithBids.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRequests(sortedRequests);
      })
      .catch(() => setError('Failed to load requests'))
      .finally(() => setLoading(false));
  }, []);

  const renderStars = (condition) => {
    const rating = condition === 'excellent' ? 5 : condition === 'good' ? 4 : 3;
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-current' : 'text-amber-400'}`} 
      />
    ));
  }

  if (loading) return <div className="text-center py-8">Loading your requests...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!requests.length) return <div className="text-center py-8 text-gray-500">No active requests found.</div>;

  // Only show 2 most recent requests if not showing all
  const displayedRequests = showAll ? requests : requests.slice(0, 2);

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Scrap Requests</h2>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <span>{showAll ? 'Show Less' : 'View All'}</span>
          <ChevronRight className="ml-1 w-3 h-3" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedRequests.map((request) => (
          <div key={request._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{request.model}</h3>
                  <p className="text-gray-500">Request ID: {request._id}</p>
                </div>
                <span className={`px-3 py-1 ${
                  request.status === 'open' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                } rounded-full text-sm`}>
                  {request.status === 'open' ? 'Pending' : 'Closed'}
                </span>
              </div>
              
              <div className="mt-4 flex items-center">
                <img 
                  src={request.photos?.[0] || '/car-placeholder.jpg'} 
                  alt={request.model} 
                  className="w-24 h-16 rounded object-cover object-top" 
                />
                <div className="ml-4">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-green-700">
                      ₹{request.highestBid.toLocaleString()}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {request.status === 'open' ? 'Highest Bid' : 'Accepted Bid'}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {renderStars(request.condition)}
                    </div>
                    <span className="ml-1 text-xs text-gray-500">Condition</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                {request.status === 'open' ? (
                  <>
                    <Link href={`/user/bids`} className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
                      <Eye className="w-4 h-4 mr-2" />
                      View Bids
                    </Link>
                    <button 
                      className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
                      onClick={() => router.push('/user/bids')}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept Offer
                    </button>
                  </>
                ) : (
                  <>
                    <Link href={`/user/bids`} className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                    <Link href="/user/pickup" className="py-2 px-4 bg-amber-600 text-white rounded hover:bg-amber-700 flex items-center justify-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Schedule Pickup
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Submitted: {new Date(request.createdAt).toLocaleDateString()}
                </span>
                <span className="text-gray-500">
                  Bids: {request.bids.length}
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