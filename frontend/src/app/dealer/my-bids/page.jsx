"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DealerMyBidsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dealerId, setDealerId] = useState("");

  useEffect(() => {
    let dealer = null;
    let token = "";
    if (typeof window !== "undefined") {
      try {
        dealer = JSON.parse(localStorage.getItem("dealer"));
        token = localStorage.getItem("token") || "";
        setDealerId(dealer?._id || "");
      } catch {}
    }
    if (!dealer || !token) {
      setError("Dealer not logged in");
      setLoading(false);
      return;
    }
    axios.get("http://localhost:8000/bid/allBids", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        // Only show cars where this dealer has placed a bid
        const myBids = res.data.filter((bid) => bid.dealer && bid.dealer._id === dealer._id);
        // Group by car
        const carMap = {};
        myBids.forEach((bid) => {
          if (!carMap[bid.car._id]) carMap[bid.car._id] = { car: bid.car, bids: [] };
          carMap[bid.car._id].bids.push(bid);
        });
        setCars(Object.values(carMap));
      })
      .catch(() => setError("Failed to load bids"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading your bids...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!cars.length) return <div className="p-8 text-center text-gray-500">You have not placed any bids yet.</div>;

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Cars You Bid On</h1>
      <div className="flex flex-col gap-8">
        {cars.map(({ car, bids }) => (
          <div key={car._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-lg text-emerald-700 mb-2">
                  {car.model} ({car.year})
                </div>
                <div className="text-gray-700 mb-1">Condition: <span className="font-bold">{car.condition}</span></div>
                <div className="text-gray-500 text-sm mb-1">Mileage: {car.mileage || 'N/A'} km</div>
                <div className="text-gray-500 text-sm mb-1">Fuel: {car.fuelType}</div>
                <div className="text-gray-500 text-sm mb-1">Description: {car.description}</div>
                <div className="text-gray-500 text-sm mb-1">Request Date: {new Date(car.createdAt).toLocaleDateString()}</div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Your Bids:</h3>
                  <ul className="space-y-2">
                    {bids.map((bid) => (
                      <li key={bid._id} className="bg-gray-50 rounded p-3 border flex flex-col md:flex-row md:items-center md:justify-between">
                        <span>Amount: <span className="font-bold">₹{bid.amount}</span></span>
                        <span>Status: {bid.isAccepted ? "Accepted" : "Pending"}</span>
                        <span>Date: {new Date(bid.createdAt).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
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
          </div>
        ))}
      </div>
    </main>
  );
}
