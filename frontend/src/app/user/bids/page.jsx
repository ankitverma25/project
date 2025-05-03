'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const page = () => {
  const [userCars, setUserCars] = useState([]);
  const [carBids, setCarBids] = useState({}); // { carId: [bids] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="p-8 text-center">Loading car details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!userCars.length) return <div className="p-8 text-center text-gray-500">No car requests found for your account.</div>;

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="flex flex-col gap-8">
        {userCars.map(car => (
          <div key={car._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <div className="rounded-lg overflow-hidden h-48 bg-gray-100">
                  <img
                    src={car.photos && car.photos.length > 0 ? car.photos[0] : '/car-placeholder.jpg'}
                    alt={car.model}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              <div className="md:w-2/3 md:pl-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-800">
                    {car.model} ({car.year})
                  </h2>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="font-medium capitalize">{car.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-medium">{car.mileage || 'N/A'} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium capitalize">{car.fuelType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{car.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Request Created</p>
                  <p className="font-medium">{new Date(car.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            {/* Bids for this car */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Bids</h3>
              {carBids[car._id] && carBids[car._id].length > 0 ? (
                <div className="space-y-4">
                  {carBids[car._id].map((bid) => (
                    <div key={bid._id} className="bg-gray-50 rounded p-4 flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">Dealer: {bid.dealer?.name || 'N/A'}</div>
                        {bid.dealer?.businessName && (
                          <div className="text-sm text-gray-500">Business: {bid.dealer.businessName}</div>
                        )}
                        {bid.dealer?.email && (
                          <div className="text-sm text-gray-500">Email: {bid.dealer.email}</div>
                        )}
                        <div className="text-sm text-gray-500">Amount: ₹{bid.amount}</div>
                        <div className="text-sm text-gray-500">Status: {bid.isAccepted ? 'Accepted' : 'Pending'}</div>
                        <div className="text-sm text-gray-500">Date: {new Date(bid.createdAt).toLocaleDateString()}</div>
                      </div>
                      {/* Actions can be added here */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No bids yet for this car.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default page;