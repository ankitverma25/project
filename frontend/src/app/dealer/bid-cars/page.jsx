"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Eye } from 'lucide-react';
import CarDetailsModal from '@/components/dealer/CarDetailsModal';

export default function DealerBidCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dealerId, setDealerId] = useState("");
  const [token, setToken] = useState("");
  const [bidAmount, setBidAmount] = useState({});
  const [placingBid, setPlacingBid] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    let dealer = null;
    let t = "";    if (typeof window !== "undefined") {
      try {
        dealer = JSON.parse(localStorage.getItem("dealer"));
        // Use dealerToken instead of token
        t = localStorage.getItem("dealerToken") || "";
        setDealerId(dealer?._id || "");
        setToken(t);
      } catch {}
    }
    if (!dealer || !t) {
      setError("Dealer not logged in");
      setLoading(false);
      return;
    }
    // Get all cars and all bids, then filter
    Promise.all([
      axios.get("http://localhost:8000/car/allCars", { headers: { Authorization: `Bearer ${t}` } }),
      axios.get("http://localhost:8000/bid/all", { headers: { Authorization: `Bearer ${t}` } })
    ])
      .then(([carRes, bidRes]) => {
        const allCars = carRes.data;
        const myBids = bidRes.data.filter((bid) => bid.dealer && bid.dealer._id === dealer._id);
        const carsBidOn = new Set(myBids.map((bid) => bid.car._id));
        // Only show cars the dealer has NOT bid on AND that are open for bidding
        setCars(allCars.filter(car => !carsBidOn.has(car._id) && car.status === "open"));
      })
      .catch(() => setError("Failed to load cars"))
      .finally(() => setLoading(false));
  }, []);

  const handleBid = async (carId) => {
    if (!bidAmount[carId] || isNaN(Number(bidAmount[carId]))) return;
    setPlacingBid(carId);
    setSuccessMsg("");
    setError("");    try {
      const dealerToken = localStorage.getItem('dealerToken');
      await axios.post("http://localhost:8000/bid/add", { car: carId, amount: bidAmount[carId] }, {
        headers: { Authorization: `Bearer ${dealerToken}` },
      });
      setSuccessMsg("Bid placed successfully!");
      setCars((prev) => prev.filter((car) => car._id !== carId));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to place bid");
      }
    }
    setPlacingBid("");
  };

  if (loading) return <div className="p-8 text-center">Loading cars...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!cars.length) return <div className="p-8 text-center text-gray-500">No cars available for bidding.</div>;

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Cars Available for Bidding</h1>
      {successMsg && <div className="mb-4 text-green-600 text-center">{successMsg}</div>}
      <div className="flex flex-col gap-8">
        {cars.map((car) => (
          <div key={car._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold text-lg text-emerald-700 mb-2">
                {car.model} ({car.year})
              </div>
              <div className="text-gray-700 mb-1">Condition: <span className="font-bold">{car.condition}</span></div>
              <div className="text-gray-500 text-sm mb-1">Mileage: {car.mileage || 'N/A'} km</div>
              <div className="text-gray-500 text-sm mb-1">Fuel: {car.fuelType}</div>
              <div className="text-gray-500 text-sm mb-1">Description: {car.description}</div>
              <div className="text-gray-500 text-sm mb-1">Request Date: {new Date(car.createdAt).toLocaleDateString()}</div>
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  placeholder="Enter bid amount"
                  className="border rounded px-3 py-1 w-40"
                  value={bidAmount[car._id] || ""}
                  onChange={e => setBidAmount({ ...bidAmount, [car._id]: e.target.value })}
                  disabled={placingBid === car._id}
                />
                <button
                  className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-60"
                  onClick={() => handleBid(car._id)}
                  disabled={placingBid === car._id}
                >
                  {placingBid === car._id ? "Placing..." : "Place Bid"}
                </button>
                <button
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
                  onClick={() => setSelectedCar(car)}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
            <div className="md:w-40 mt-4 md:mt-0 md:ml-6">
              <img
                src={car.photos && car.photos.length > 0 ? car.photos[0] : "/car-placeholder.jpg"}
                alt={car.model}
                className="w-full h-24 object-cover rounded-lg border"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Car Details Modal */}
      {selectedCar && (
        <CarDetailsModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </main>
  );
}
