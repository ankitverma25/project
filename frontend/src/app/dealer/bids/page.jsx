// app/dealer/bids/page.js
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DealerBidsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Track bid amount for each car
  const [bidAmounts, setBidAmounts] = useState({});
  const [bidLoading, setBidLoading] = useState({});
  const [bidSuccess, setBidSuccess] = useState({});
  const [bidError, setBidError] = useState({});

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/car/allCars', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => setCars(res.data))
      .catch(() => setError('Failed to load cars'))
      .finally(() => setLoading(false));
  }, []);

  const handleBidChange = (carId, value) => {
    setBidAmounts({ ...bidAmounts, [carId]: value });
  };

  const handleBidSubmit = async (carId) => {
    setBidLoading({ ...bidLoading, [carId]: true });
    setBidSuccess({ ...bidSuccess, [carId]: false });
    setBidError({ ...bidError, [carId]: '' });
    try {
      const token = localStorage.getItem('token');
      const dealer = JSON.parse(localStorage.getItem('user'));
      const amount = Number(bidAmounts[carId]);
      if (!amount || amount <= 0) throw new Error('Enter a valid amount');
      await axios.post('http://localhost:8000/bid/add', {
        car: carId,
        dealer: dealer._id,
        amount
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setBidSuccess({ ...bidSuccess, [carId]: true });
      setBidAmounts({ ...bidAmounts, [carId]: '' });
    } catch (err) {
      setBidError({ ...bidError, [carId]: err.response?.data?.message || err.message || 'Failed to place bid' });
    }
    setBidLoading({ ...bidLoading, [carId]: false });
  };

  // Filter only unsold cars (status: "open")
  const openCars = cars.filter(car => car.status === "open");

  if (loading) return <div className="p-8 text-center">Loading cars...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!openCars.length) return <div className="p-8 text-center text-gray-500">No cars available for bidding.</div>;

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">All Cars Available for Bidding</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openCars.map(car => (
          <div key={car._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
            <div className="h-40 w-full rounded-lg overflow-hidden bg-gray-100 mb-4">
              <img
                src={car.photos && car.photos.length > 0 ? car.photos[0] : '/car-placeholder.jpg'}
                alt={car.model}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h2 className="text-lg font-bold mb-1">{car.model} ({car.year})</h2>
            <div className="text-sm text-gray-600 mb-2">{car.description}</div>
            <div className="flex flex-wrap gap-2 text-xs mb-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{car.condition}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{car.fuelType}</span>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">{car.mileage || 'N/A'} km</span>
              {car.estimatedValue && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Est. Value: ₹{car.estimatedValue}
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  placeholder="Enter bid amount (₹)"
                  className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-200"
                  value={bidAmounts[car._id] || ''}
                  onChange={e => handleBidChange(car._id, e.target.value)}
                  disabled={bidLoading[car._id]}
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
                  onClick={() => handleBidSubmit(car._id)}
                  disabled={bidLoading[car._id]}
                >
                  {bidLoading[car._id] ? 'Placing Bid...' : 'Place Bid'}
                </button>
              </div>
              {bidSuccess[car._id] && <div className="text-green-600 text-sm font-semibold border border-green-200 bg-green-50 rounded px-3 py-1 mt-1">Bid placed successfully!</div>}
              {bidError[car._id] && <div className="text-red-500 text-sm font-semibold border border-red-200 bg-red-50 rounded px-3 py-1 mt-1">{bidError[car._id]}</div>}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}