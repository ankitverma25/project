'use client';
import { useEffect, useState } from "react";
import axios from "axios";

export default function PendingDealerApprovals() {
  const [pendingDealers, setPendingDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState("");

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:8000/dealer/pending");
        setPendingDealers(res.data);
      } catch (err) {
        setError("Failed to fetch pending dealers");
      }
      setLoading(false);
    };
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    setApproving(id);
    try {
      await axios.patch(`http://localhost:8000/dealer/approve/${id}`);
      setPendingDealers((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert("Failed to approve dealer");
    }
    setApproving("");
  };

  if (loading) return <div>Loading pending dealers...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">Pending Dealer Approvals</h2>
      {pendingDealers.length === 0 ? (
        <div className="text-gray-500">No pending dealers.</div>
      ) : (
        <ul>
          {pendingDealers.map((dealer) => (
            <li key={dealer._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <div>
                <div className="font-semibold">{dealer.name}</div>
                <div className="text-xs text-gray-500">{dealer.email} &bull; {dealer.businessName}</div>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs disabled:opacity-50"
                  onClick={() => handleApprove(dealer._id)}
                  disabled={approving === dealer._id}
                >
                  {approving === dealer._id ? "Approving..." : "Approve"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}