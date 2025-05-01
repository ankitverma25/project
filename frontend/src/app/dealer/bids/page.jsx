// app/dealer/bids/page.js
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DealerBidsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/car/allCars')
      .then(res => setCars(res.data))
      .catch(() => setError('Failed to load cars'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading cars...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!cars.length) return <div className="p-8 text-center text-gray-500">No cars available for bidding.</div>;

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">All Cars Available for Bidding</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map(car => (
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
            </div>
            {/* Placeholder for bid form/button */}
            <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Place Bid</button>
          </div>
        ))}
      </div>
    </main>
  );
}