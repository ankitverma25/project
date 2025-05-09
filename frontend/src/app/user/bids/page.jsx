'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, MapPin, User, Phone, FileText, Calendar, BadgeCheck, X } from "lucide-react";
import toast from 'react-hot-toast';

export default function UserBidsPage() {
  const [userCars, setUserCars] = useState([]);
  const [carBids, setCarBids] = useState({}); // { carId: [bids] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeBidFilter, setActiveBidFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [selectedBids, setSelectedBids] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [acceptingBidId, setAcceptingBidId] = useState("");

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
    axios.get('http://localhost:8000/car/allCars', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        const cars = res.data.filter(car => car.owner && (car.owner._id === userId || car.owner === userId));
        setUserCars(cars);
        // Fetch bids for each car
        const bidsObj = {};
        await Promise.all(
          cars.map(async (car) => {
            try {
              const bidRes = await axios.get(`http://localhost:8000/bid/car/${car._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              bidsObj[car._id] = bidRes.data;
            } catch {
              bidsObj[car._id] = [];
            }
          })
        );
        setCarBids(bidsObj);
      })
      .catch(() => setError('Failed to load car details'))
      .finally(() => setLoading(false));
  }, []);

  const toggleBidSelection = (bidId) => {
    setSelectedBids((prev) =>
      prev.includes(bidId) ? prev.filter((id) => id !== bidId) : [...prev, bidId]
    );
  };

  // Accept bid handler
  const handleAcceptBid = async (bidId, carId) => {
    const loadingToast = toast.loading('Accepting bid...');
    setAcceptingBidId(bidId);
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    try {
      const response = await axios.post(`http://localhost:8000/bid/accept/${bidId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update UI to reflect changes
      setCarBids(prev => ({
        ...prev,
        [carId]: prev[carId].map(bid => ({
          ...bid,
          isAccepted: bid._id === bidId
        }))
      }));

      // Update car status in UI
      setUserCars(prev => 
        prev.map(car => 
          car._id === carId ? { ...car, status: 'closed' } : car
        )
      );

      toast.success('Bid accepted successfully!', { id: loadingToast });

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to accept bid';
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setAcceptingBidId("");
    }
  };

  // Helper to get selected bid objects (max 3)
  const getSelectedBidObjects = () => {
    const allBids = Object.values(carBids).flat();
    return allBids.filter(bid => selectedBids.includes(bid._id)).slice(0, 3);
  };

  // Helper to render star rating
  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} size={18} className={i <= rating ? 'text-yellow-400 inline' : 'text-gray-300 inline'} fill={i <= rating ? '#facc15' : 'none'} />
      );
    }
    return stars;
  };

  if (loading) return <div className="p-8 text-center">Loading car details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!userCars.length) return <div className="p-8 text-center text-gray-500">No car requests found for your account.</div>;

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
      {/* Bid Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowCompareModal(false)}
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2"><BadgeCheck className="text-blue-600" size={28}/>Bid Comparison</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="text-left text-gray-600 font-semibold p-2">Field</th>
                    {getSelectedBidObjects().map((bid, idx) => (
                      <th key={bid._id} className="text-center text-blue-700 font-bold p-2">Bid {idx + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium text-gray-700 p-2 flex items-center gap-2"><User size={18}/>Dealer</td>
                    {getSelectedBidObjects().map(bid => (
                      <td key={bid._id} className="text-center p-2">
                        <div className="flex flex-col items-center">
                          <img src={bid.dealer?.avatar || "/avatar-placeholder.png"} alt={bid.dealer?.name || "Dealer"} className="w-12 h-12 rounded-full object-cover mb-1" />
                          <span className="font-semibold text-gray-800">{bid.dealer?.name || "Dealer"}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700 p-2 flex items-center gap-2"><Star size={18}/>Rating</td>
                    {getSelectedBidObjects().map(bid => (
                      <td key={bid._id} className="text-center p-2">
                        <div className="flex items-center justify-center gap-1">
                          {renderStars(Math.round(bid.dealer?.rating || 0))}
                          <span className="ml-1 text-sm text-gray-600">{bid.dealer?.rating || '-'}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700 p-2 flex items-center gap-2"><MapPin size={18}/>Location</td>
                    {getSelectedBidObjects().map(bid => (
                      <td key={bid._id} className="text-center p-2">{bid.dealer?.location || '-'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700 p-2 flex items-center gap-2"><FileText size={18}/>Bid Amount</td>
                    {getSelectedBidObjects().map(bid => (
                      <td key={bid._id} className="text-center p-2 text-lg font-bold text-blue-700">₹{bid.amount}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700 p-2 flex items-center gap-2"><Calendar size={18}/>Date</td>
                    {getSelectedBidObjects().map(bid => (
                      <td key={bid._id} className="text-center p-2">{new Date(bid.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700 p-2 flex items-center gap-2"><BadgeCheck size={18}/>Status</td>
                    {getSelectedBidObjects().map(bid => (
                      <td key={bid._id} className="text-center p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bid.isAccepted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{bid.isAccepted ? 'Accepted' : 'Pending'}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700 p-2 flex items-center gap-2"><FileText size={18}/>Description</td>
                    {getSelectedBidObjects().map(bid => (
                      <td key={bid._id} className="text-center p-2 text-sm text-gray-700">{bid.notes || '-'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700 p-2 flex items-center gap-2"><Phone size={18}/>Contact</td>
                    {getSelectedBidObjects().map(bid => (
                      <td key={bid._id} className="text-center p-2 text-sm text-blue-600">{bid.dealer?.contact || '-'}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
              {getSelectedBidObjects().length === 0 && (
                <div className="text-center text-gray-500 py-8">No bids selected for comparison.</div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-14 max-w-7xl mx-auto">
        {/* Left column - Vehicle details and bids */}
        <div className="lg:w-2/3 w-full">
          {userCars.map(car => {
            const bids = carBids[car._id] || [];
            const sortedBids = [...bids].sort((a, b) => {
              if (sortOption === 'highest') return b.amount - a.amount;
              if (sortOption === 'lowest') return a.amount - b.amount;
              if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
              if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
              return 0;
            });

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
                          <p className="text-xs sm:text-sm text-gray-500">Fuel Type</p>
                          <p className="font-medium text-sm sm:text-base">{car.fuelType || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Location</p>
                          <p className="font-medium text-sm sm:text-base">{car.address?.city || 'N/A'}</p>
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
                      </div>
                      <div className="md:w-1/4 mb-3 md:mb-0">
                        <p className="text-xs sm:text-sm text-gray-500">Date</p>
                        <p className="font-medium text-sm sm:text-base">{new Date(bid.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{bid.dealer?.location || "-"}</p>
                      </div>
                      <div className="md:w-1/4 flex flex-wrap gap-2 justify-end">
                        <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer" onClick={() => console.log('Show bid details')}>
                          <i className="fas fa-info-circle mr-1.5"></i>Details
                        </button>
                        {/* Accept Bid Button or Sold Badge */}
                        {car.status === 'closed' ? (
                          bid.isAccepted ? (
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs sm:text-sm font-medium flex items-center">
                              <BadgeCheck className="w-4 h-4 mr-1" />
                              Accepted
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs sm:text-sm font-medium">
                              Bidding Closed
                            </span>
                          )
                        ) : (
                          <button
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 flex items-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={() => handleAcceptBid(bid._id, car._id)}
                            disabled={acceptingBidId === bid._id}
                          >
                            {acceptingBidId === bid._id ? 'Accepting...' : 'Accept Bid'}
                          </button>
                        )}
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