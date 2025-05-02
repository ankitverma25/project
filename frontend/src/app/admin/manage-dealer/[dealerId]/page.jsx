import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDealerDetailPage({ params }) {
  const [dealer, setDealer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    const fetchDealer = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`http://localhost:8000/dealer/${params.dealerId}`);
        setDealer(res.data);
      } catch (err) {
        setError("Dealer not found");
      }
      setLoading(false);
    };
    fetchDealer();
  }, [params.dealerId]);

  const handleApprove = async () => {
    setActionLoading(true);
    setActionMsg("");
    try {
      await axios.patch(`http://localhost:8000/dealer/approve/${params.dealerId}`);
      setDealer((prev) => ({ ...prev, isApproved: true }));
      setActionMsg("Dealer approved successfully.");
    } catch (err) {
      setActionMsg("Failed to approve dealer.");
    }
    setActionLoading(false);
  };

  if (loading) return <main className="p-6">Loading...</main>;
  if (error) return <main className="p-6 text-red-500">{error}</main>;

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dealer Details: {dealer._id}</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-xl">
        <div className="mb-4">
          <div className="font-semibold">Name:</div>
          <div className="text-gray-700">{dealer.name}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold">Email:</div>
          <div className="text-gray-700">{dealer.email}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold">Business Name:</div>
          <div className="text-gray-700">{dealer.businessName}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold">License Number:</div>
          <div className="text-gray-700">{dealer.licenseNumber}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold">Status:</div>
          <span className={dealer.isApproved ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>
            {dealer.isApproved ? "Approved" : "Pending Approval"}
          </span>
        </div>
        <div className="flex gap-4 mt-6">
          {!dealer.isApproved && (
            <button
              onClick={handleApprove}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
              disabled={actionLoading}
            >
              {actionLoading ? "Approving..." : "Approve"}
            </button>
          )}
        </div>
        {actionMsg && <div className="mt-4 text-sm text-emerald-700">{actionMsg}</div>}
      </div>
    </main>
  );
}