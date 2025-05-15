'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function UserBidsPage() {
  const [userCars, setUserCars] = useState([]);
  const [carBids, setCarBids] = useState({}); // { carId: [bids] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeBidFilter, setActiveBidFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [selectedBids, setSelectedBids] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Function to fetch bids for a specific car
  const fetchBidsForCar = async (carId, token) => {
    try {
      const bidRes = await axios.get(`http://localhost:8000/bid/car/${carId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return bidRes.data;
    } catch (error) {
      console.error(`Error fetching bids for car ${carId}:`, error);
      return [];
    }
  };

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

    const loadData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/car/allCars', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const cars = res.data.filter(car => car.owner && (car.owner._id === userId || car.owner === userId));
        setUserCars(cars);

        // Fetch bids for each car
        const bidsObj = {};
        await Promise.all(
          cars.map(async (car) => {
            bidsObj[car._id] = await fetchBidsForCar(car._id, token);
          })
        );

        // After fetching, if any bid is accepted, mark all others as rejected (for UI)
        Object.keys(bidsObj).forEach(carId => {
          const carBidsArr = bidsObj[carId] || [];
          const acceptedBid = carBidsArr.find(bid => bid.status === 'accepted');
          if (acceptedBid) {
            bidsObj[carId] = carBidsArr.map(bid =>
              bid._id === acceptedBid._id
                ? { ...bid, status: 'accepted', _showAccepted: true }
                : { ...bid, status: 'rejected', _showAccepted: false }
            );
          }
        });
        setCarBids(bidsObj);
      } catch (err) {
        setError('Failed to load car details');
        toast.error('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  const handleAcceptBid = async (bidId, carId) => {
    const currentBids = carBids[carId] || [];
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Optimistically update UI first
      setCarBids(prev => ({
        ...prev,
        [carId]: currentBids.map(bid => ({
          ...bid,
          status: bid._id === bidId ? 'accepted' : 'pending'
        }))
      }));

      const response = await axios.post(
        `http://localhost:8000/bid/accept/${bidId}`,
        { carId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update UI after successful acceptance
        const updatedBids = currentBids.map(bid => ({
          ...bid,
          status: bid._id === bidId ? 'accepted' : 'rejected'
        }));

        setCarBids(prev => ({
          ...prev,
          [carId]: updatedBids
        }));

        // Update car status to closed in the UI
        setUserCars(prev => prev.map(car => 
          car._id === carId 
            ? { ...car, status: 'closed' }
            : car
        ));

        toast.success('Bid accepted successfully');
      } else {
        // If backend fails, revert the changes
        setCarBids(prev => ({
          ...prev,
          [carId]: currentBids
        }));
        toast.error(response.data.message || 'Failed to accept bid');
      }
    } catch (error) {
      console.error('Error accepting bid:', error);
      // Revert changes on error
      setCarBids(prev => ({
        ...prev,
        [carId]: currentBids
      }));
      
      if (error.response?.status === 400 && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to accept bid. Please try again.');
      }
    }
  };

  const toggleBidSelection = (bidId) => {
    setSelectedBids((prev) =>
      prev.includes(bidId) ? prev.filter((id) => id !== bidId) : [...prev, bidId]
    );
  };

  if (loading) return <div className="p-8 text-center">Loading car details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!userCars.length) return <div className="p-8 text-center text-gray-500">No car requests found for your account.</div>;

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-14 max-w-7xl mx-auto">
        {/* Left column - Vehicle details and bids */}
        <div className="lg:w-2/3 w-full">
          {userCars.map(car => {            let bids = carBids[car._id] || [];
              // Filter bids based on status
            if (activeBidFilter !== 'all') {
              bids = bids.filter(bid => {
                if (activeBidFilter === 'pending') {
                  return !bid.status || bid.status === 'pending';
                }
                return bid.status === activeBidFilter;
              });
            }

            const sortedBids = [...bids].sort((a, b) => {
              if (sortOption === 'highest') return b.amount - a.amount;
              if (sortOption === 'lowest') return a.amount - b.amount;
              if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
              if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
              return 0;
            });
            const highestBid = Math.max(...bids.map(bid => bid.amount), 0);
            const averageBid = bids.length ? (bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length).toFixed(2) : 0;

            return (
              <div key={car._id} className="mb-10">
                {/* Vehicle details card */}
                <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6 flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 w-full flex-shrink-0">
                    <div className="rounded-xl overflow-hidden h-44 sm:h-52 bg-gray-100 flex items-center justify-center">
                      <img
                        src={car.photos && car.photos.length > 0 ? car.photos[0] : "/car-placeholder.jpg"}
                        alt={car.model}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3 w-full md:pl-6 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                          {car.model} ({car.year})
                        </h2>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {bids.length} Active Bids
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:gap-y-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Condition</p>
                          <p className="font-medium text-sm sm:text-base">{car.condition}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Mileage</p>
                          <p className="font-medium text-sm sm:text-base">{car.mileage || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Last Serviced</p>
                          <p className="font-medium text-sm sm:text-base">{car.lastServiced || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Location</p>
                          <p className="font-medium text-sm sm:text-base">{car.location || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs sm:text-sm text-gray-500">Request Created</p>
                        <p className="font-medium text-sm sm:text-base">{new Date(car.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bids filter and sort */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <div className="flex space-x-2 mb-3 sm:mb-0">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${activeBidFilter === "all" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"} cursor-pointer`}
                      onClick={() => setActiveBidFilter("all")}
                    >
                      All Bids
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${activeBidFilter === "pending" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"} cursor-pointer`}
                      onClick={() => setActiveBidFilter("pending")}
                    >
                      Pending
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${activeBidFilter === "accepted" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"} cursor-pointer`}
                      onClick={() => setActiveBidFilter("accepted")}
                    >
                      Accepted
                    </button>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs sm:text-sm text-gray-500 mr-2">Sort by:</span>
                    <div className="relative">
                      <button
                        className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center cursor-pointer"
                        onClick={() => document.getElementById("sortDropdown")?.classList.toggle("hidden")}
                      >
                        {sortOption === "highest" && "Highest Price"}
                        {sortOption === "lowest" && "Lowest Price"}
                        {sortOption === "newest" && "Newest First"}
                        {sortOption === "oldest" && "Oldest First"}
                        <i className="fas fa-chevron-down ml-2 text-xs"></i>
                      </button>
                      <div
                        id="sortDropdown"
                        className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-100"
                      >
                        <ul className="py-1">
                          <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => { setSortOption("highest"); document.getElementById("sortDropdown")?.classList.add("hidden"); }}>Highest Price</li>
                          <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => { setSortOption("lowest"); document.getElementById("sortDropdown")?.classList.add("hidden"); }}>Lowest Price</li>
                          <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => { setSortOption("newest"); document.getElementById("sortDropdown")?.classList.add("hidden"); }}>Newest First</li>
                          <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => { setSortOption("oldest"); document.getElementById("sortDropdown")?.classList.add("hidden"); }}>Oldest First</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compare button */}
                {selectedBids.length > 0 && (
                  <div className="mb-4 bg-blue-50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div>
                      <span className="text-blue-800 font-medium">
                        {selectedBids.length} {selectedBids.length === 1 ? "bid" : "bids"} selected
                      </span>
                      <p className="text-xs sm:text-sm text-blue-600">Select up to 3 bids to compare</p>
                    </div>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
                      onClick={() => setShowCompareModal(true)}
                    >
                      Compare Bids
                    </button>
                  </div>
                )}

                {/* Bids list */}
                <div className="space-y-4">
                  {sortedBids.map((bid) => (
                    <div key={bid._id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow duration-200 flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
                      <div className="mr-4 mb-3 md:mb-0 flex-shrink-0 flex items-center">
                        <input
                          type="checkbox"
                          id={`compare-${bid._id}`}
                          className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                          checked={selectedBids.includes(bid._id)}
                          onChange={() => toggleBidSelection(bid._id)}
                        />
                      </div>
                      <div className="flex items-center mb-3 md:mb-0 md:w-1/4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img src={bid.dealer?.avatar || "/avatar-placeholder.png"} alt={bid.dealer?.name || "Dealer"} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-800">{bid.dealer?.name || "Dealer"}</h3>
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1"><i className="fas fa-star text-xs"></i></span>
                            <span className="text-sm text-gray-600">{bid.dealer?.rating || "-"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/4 mb-3 md:mb-0">
                        <p className="text-xs sm:text-sm text-gray-500">Bid Amount</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-800">₹{bid.amount}</p>
                        {bid.amount === highestBid && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Highest Bid</span>
                        )}
                      </div>                      <div className="md:w-1/4 mb-3 md:mb-0">
                        <p className="text-xs sm:text-sm text-gray-500">Date</p>
                        <p className="font-medium text-sm sm:text-base">{new Date(bid.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{bid.dealer?.location || "-"}</p>
                      </div>                      <div className="md:w-1/4 flex flex-wrap gap-2 justify-end">  {/* Accept button: show for pending bids if car is open and no bid is accepted */}
  {(!bids.some(b => b.status === 'accepted')) && (!bid.status || bid.status === 'pending') && car.status !== 'closed' && !car.isSold && (
    <button
      onClick={() => handleAcceptBid(bid._id, car._id)}
      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-green-600 flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <span>Accept Bid</span>
    </button>
  )}
  {/* Accepted badge */}
  {bid.status === 'accepted' && (
    <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Accepted
    </span>
  )}
  {/* Bidding Closed for all other bids after one is accepted */}
  {(bids.some(b => b.status === 'accepted') && bid.status !== 'accepted') && (
    <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
      Bidding Closed
    </span>
  )}
  {/* Details button (unchanged) */}
  <button 
    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2" 
    onClick={() => console.log('Show bid details')}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
    Details
  </button>
</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {/* Right column - Statistics */}
        <div className="lg:w-1/3 w-full">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Bid Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-gray-600">Total Bids</span><span className="font-medium text-gray-800">{Object.values(carBids).flat().length}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-600">Highest Bid</span><span className="font-medium text-gray-800">₹{Math.max(...Object.values(carBids).flat().map(bid => bid.amount), 0)}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-600">Average Bid</span><span className="font-medium text-gray-800">₹{(Object.values(carBids).flat().reduce((sum, bid) => sum + bid.amount, 0) / Object.values(carBids).flat().length || 0).toFixed(2)}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-600">Time Active</span><span className="font-medium text-gray-800">5 days</span></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}