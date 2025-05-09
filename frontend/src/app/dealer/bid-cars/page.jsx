"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function DealerBidCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dealerId, setDealerId] = useState("");
  const [token, setToken] = useState("");
  const [bidAmount, setBidAmount] = useState({});
  const [placingBid, setPlacingBid] = useState("");

  useEffect(() => {
    let dealer = null;
    let t = "";
    if (typeof window !== "undefined") {
      try {
        dealer = JSON.parse(localStorage.getItem("dealer"));
        t = localStorage.getItem("token") || "";
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
      axios.get("http://localhost:8000/bid/allBids", { headers: { Authorization: `Bearer ${t}` } })
    ])
      .then(([carRes, bidRes]) => {
        const allCars = carRes.data;
        const myBids = bidRes.data.filter((bid) => bid.dealer && bid.dealer._id === dealer._id);
        const carsBidOn = new Set(myBids.map((bid) => bid.car._id));
        // Only show cars that are:
        // 1. Not already bid on by this dealer
        // 2. Still open for bidding
        setCars(allCars.filter(car => !carsBidOn.has(car._id) && car.status === 'open'));
      })
      .catch(() => setError("Failed to load cars"))
      .finally(() => setLoading(false));
  }, []);

  const handleBid = async (carId) => {
    if (!bidAmount[carId] || isNaN(Number(bidAmount[carId]))) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    const loadingToast = toast.loading('Placing your bid...');
    setPlacingBid(carId);
    try {
      const response = await axios.post(
        "http://localhost:8000/bid/add", 
        { 
          car: carId, 
          amount: bidAmount[carId] 
        }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Bid placed successfully!', { id: loadingToast });
      // Remove this car from the list since we've bid on it
      setCars((prev) => prev.filter((car) => car._id !== carId));
      setBidAmount((prev) => {
        const updated = { ...prev };
        delete updated[carId];
        return updated;
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to place bid';
      toast.error(errorMessage, { id: loadingToast });
    }
    setPlacingBid("");
  };

  if (loading) return <div className="p-8 text-center">Loading cars...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!cars.length) return <div className="p-8 text-center text-gray-500">No cars available for bidding.</div>;

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Cars Available for Bidding</h1>
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
              <div className="mt-4 flex gap-2 items-center">
                {car.status === 'closed' ? (
                  <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm font-medium">Bidding Closed</span>
                ) : (
                  <>
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
                  </>
                )}
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
    </main>
  );
}
