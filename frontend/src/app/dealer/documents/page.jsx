'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function DealerDocumentsPage() {
  const [cars, setCars] = useState([]);
  const [verifying, setVerifying] = useState({});
  const [rejectReason, setRejectReason] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedCar, setExpandedCar] = useState(null);

  useEffect(() => {
    fetchSubmittedCars();
  }, []);

  const fetchSubmittedCars = async () => {
    setLoading(true);
    setError('');
    try {
      // Always use dealerToken for dealer-specific actions
      const dealerToken = localStorage.getItem('dealerToken');
      if (!dealerToken) {
        throw new Error('Dealer authentication required');
      }

      const res = await axios.get('http://localhost:8000/car/submitted-documents', {
        headers: { Authorization: `Bearer ${dealerToken}` }
      });
      setCars(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load submitted documents');
      toast.error(err.message || 'Failed to load submitted documents');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (carId, docKey) => {
    setVerifying(v => ({ ...v, [carId]: { ...v[carId], [docKey]: true } }));
    try {
      // Always use dealerToken for dealer-specific actions
      const dealerToken = localStorage.getItem('dealerToken');
      if (!dealerToken) {
        throw new Error('Dealer authentication required');
      }

      // Verify document
      await axios.post(`http://localhost:8000/car/verify-document`, {
        carId, docKey, status: 'verified'
      }, { headers: { Authorization: `Bearer ${dealerToken}` } });
      
      // Check if this was the last document to verify
      const car = cars.find(c => c._id === carId);
      const verifiedCount = ['idProof','insurance','pollution','addressProof']
        .filter(key => {
          if (key === docKey) return true; // Count the current one as verified
          return car.documents?.[key]?.status === 'verified';
        }).length;
        // If all documents are verified, create a pickup
      if (verifiedCount === 4) {
        try {
          // Get dealer info
          const dealer = JSON.parse(localStorage.getItem('dealer'));
          
          // Create pickup
          await axios.post(`http://localhost:8000/pickup/create`, {
            carId: car._id,
            userId: car.owner._id || car.owner,
            dealerId: dealer._id
          }, {
            headers: { 
              'Authorization': `Bearer ${dealerToken}`,
              'Content-Type': 'application/json'
            }
          });
          toast.success('All documents verified and pickup created successfully!');
        } catch (err) {
          console.error('Failed to create pickup:', err);
          if (err.response?.status === 401) {
            toast.error('Your session has expired. Please login again.');
            window.location.href = '/dealer_login';
            return;
          } else if (err.response?.data?.message) {
            toast.error(err.response.data.message);
          } else {
            toast.error('Failed to create pickup. Please try again.');
          }
        }
      }
      
      fetchSubmittedCars();
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify document');
      toast.error(err.message || 'Failed to verify document');
    }
    setVerifying(v => ({ ...v, [carId]: { ...v[carId], [docKey]: false } }));
  };

  const handleReject = async (carId, docKey) => {
    if (!rejectReason[carId]?.[docKey]) return;
    setVerifying(v => ({ ...v, [carId]: { ...v[carId], [docKey]: true } }));
    try {
      // Always use dealerToken for dealer-specific actions
      const dealerToken = localStorage.getItem('dealerToken');
      if (!dealerToken) {
        throw new Error('Dealer authentication required');
      }

      await axios.post(`http://localhost:8000/car/verify-document`, {
        carId, docKey, status: 'rejected', rejectionMessage: rejectReason[carId][docKey]
      }, { headers: { Authorization: `Bearer ${dealerToken}` } });
      
      fetchSubmittedCars();
    } catch (err) {
      console.error('Rejection error:', err);
      setError(err.message || 'Failed to reject document');
      toast.error(err.message || 'Failed to reject document');
    }
    setVerifying(v => ({ ...v, [carId]: { ...v[carId], [docKey]: false } }));
  };

  const filteredCars = cars.filter(car =>
    car.model.toLowerCase().includes(search.toLowerCase()) ||
    car.owner?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading submitted documents...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-32">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Verify User Documents</h1>
        <input
          type="text"
          placeholder="Search by car model or owner..."
          className="border rounded px-3 py-2 w-full md:w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="space-y-4">
        {filteredCars.length === 0 && (
          <div className="text-center text-gray-500 py-12">No submitted cars found.</div>
        )}
        {filteredCars.map(car => {
          const isExpanded = expandedCar === car._id;
          const completedDocs = ['idProof','insurance','pollution','addressProof'].filter(docKey => car.documents?.[docKey]?.status === 'verified').length;
          const totalDocs = 4;
          return (
            <div key={car._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <FileText className="text-blue-400" size={32} />
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-emerald-700">{car.model} ({car.year})</div>
                    <div className="text-gray-500 text-sm">Owner: {car.owner?.name || car.owner}</div>
                    <div className="text-gray-500 text-sm">Dealer: {car.acceptedDealerName}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 mb-1">{car.status === 'closed' ? 'Bidding Closed' : 'Bidding Open'}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(completedDocs / totalDocs) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{completedDocs}/{totalDocs} Verified</span>
                  </div>
                  <button
                    className="text-blue-600 text-xs underline mt-1"
                    onClick={() => setExpandedCar(isExpanded ? null : car._id)}
                  >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
              </div>
              {isExpanded && (
                <div className="mt-4 divide-y divide-gray-200">
                  {['idProof','insurance','pollution','addressProof'].map(docKey => {
                    const doc = car.documents?.[docKey];
                    return (
                      <div key={docKey} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <FileText className="text-blue-600" size={20} />
                          <span className="font-medium">{docKey.replace(/([A-Z])/g, ' $1')}</span>
                          {doc?.status === 'verified' && <CheckCircle className="text-green-500" size={18} title="Verified" />}
                          {doc?.status === 'rejected' && <XCircle className="text-red-500" size={18} title="Rejected" />}
                          {doc?.status === 'pending' && <AlertCircle className="text-yellow-500" size={18} title="Pending" />}
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                          {doc?.url && (
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center gap-1">
                              <Download size={16} /> View/Download
                            </a>
                          )}
                          {doc?.status === 'pending' && (
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                              <button
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                                disabled={verifying[car._id]?.[docKey]}
                                onClick={() => handleVerify(car._id, docKey)}
                              >
                                {verifying[car._id]?.[docKey] ? 'Verifying...' : 'Verify'}
                              </button>
                              <input
                                type="text"
                                placeholder="Rejection reason"
                                className="border rounded px-2 py-1 text-xs w-32"
                                value={rejectReason[car._id]?.[docKey] || ''}
                                onChange={e => setRejectReason(r => ({ ...r, [car._id]: { ...r[car._id], [docKey]: e.target.value } }))}
                              />
                              <button
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                                disabled={verifying[car._id]?.[docKey] || !(rejectReason[car._id]?.[docKey])}
                                onClick={() => handleReject(car._id, docKey)}
                              >
                                {verifying[car._id]?.[docKey] ? 'Rejecting...' : 'Reject'}
                              </button>
                            </div>
                          )}
                          {doc?.status === 'rejected' && doc?.rejectionMessage && (
                            <span className="text-xs text-red-500 ml-2">Reason: {doc.rejectionMessage}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Show pickup scheduling status if all docs are verified */}
              {completedDocs === totalDocs && (
                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded p-3">
                  <span className="text-emerald-700 font-medium flex items-center gap-2">
                    <CheckCircle className="text-emerald-500" size={18} />
                    All documents verified. Ready for pickup scheduling.
                  </span>
                  {/* Optionally, you can add a button to go to pickup scheduling page or trigger pickup creation here */}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
