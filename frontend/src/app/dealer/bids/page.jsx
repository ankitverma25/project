// app/dealer/bids/page.js
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DealerBidsPage() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let dealer = null;
    let token = "";
    if (typeof window !== "undefined") {
      try {
        dealer = JSON.parse(localStorage.getItem("dealer"));
        token = localStorage.getItem("token") || "";
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
        // Only show bids placed by this dealer
        setBids(res.data.filter((bid) => bid.dealer && bid.dealer._id === dealer._id));
      })
      .catch(() => setError("Failed to load bids"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading your bids...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!bids.length) return <div className="p-8 text-center text-gray-500">You have not placed any bids yet.</div>;

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">My Bids</h1>
      <div className="flex flex-col gap-8">
        {bids.map((bid) => (
          <div key={bid._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold text-lg text-emerald-700 mb-2">
                {bid.car?.model} ({bid.car?.year})
              </div>
              <div className="text-gray-700 mb-1">Amount: <span className="font-bold">₹{bid.amount}</span></div>
              <div className="text-gray-500 text-sm mb-1">Status: {bid.isAccepted ? "Accepted" : "Pending"}</div>
              <div className="text-gray-500 text-sm">Date: {new Date(bid.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="md:w-40 mt-4 md:mt-0 md:ml-6">
              <img
                src={bid.car?.photos && bid.car.photos.length > 0 ? bid.car.photos[0] : "/car-placeholder.jpg"}
                alt={bid.car?.model}
                className="w-full h-24 object-cover rounded-lg border"
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}