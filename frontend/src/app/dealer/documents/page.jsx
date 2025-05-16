'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Download, CheckCircle, XCircle, AlertCircle, ThumbsUp, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function DealerDocumentsPage() {
  const [cars, setCars] = useState([]);
  const [verifying, setVerifying] = useState({});
  const [rejectReason, setRejectReason] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedCar, setExpandedCar] = useState(null);
  const [verifyingFinalMap, setVerifyingFinalMap] = useState({});
  const [processingDocId, setProcessingDocId] = useState(null);

  useEffect(() => {
    fetchSubmittedCars();
  }, []);
  const fetchSubmittedCars = async () => {
    setLoading(true);
    setError('');
    try {
      const dealerToken = localStorage.getItem('dealerToken');
      if (!dealerToken) {
        throw new Error('Dealer authentication required');
      }

      const res = await axios.get('http://localhost:8000/car/submitted-documents', {
        headers: { Authorization: `Bearer ${dealerToken}` }
      });

      // Ensure readyForPickup is properly set for each car
      const carsWithReadyStatus = res.data.map(car => ({
        ...car,
        readyForPickup: car.readyForPickup || car.documentStatus === 'verified'
      }));
      
      setCars(carsWithReadyStatus);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load submitted documents');
      toast.error(err.message || 'Failed to load submitted documents');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (carId, docKey) => {
    setProcessingDocId(`${carId}-${docKey}`);
    setVerifying(v => ({ ...v, [carId]: { ...v[carId], [docKey]: true } }));
    
    const toastId = toast.loading(
      <div className="flex items-center gap-2">
        <Loader2 className="animate-spin" />
        <div>
          <p className="font-medium">Verifying Document</p>
          <p className="text-sm">Please wait...</p>
        </div>
      </div>
    );

    try {
      const dealerToken = localStorage.getItem('dealerToken');
      if (!dealerToken) {
        throw new Error('Dealer authentication required');
      }

      await axios.post(`http://localhost:8000/car/verify-document`, {
        carId, docKey, status: 'verified'
      }, { headers: { Authorization: `Bearer ${dealerToken}` } });

      toast.update(toastId, {
        render: (
          <div className="flex items-center gap-2">
            <CheckCircle className="text-white" />
            <div>
              <p className="font-medium">Document Verified!</p>
              <p className="text-sm">Successfully verified the document</p>
            </div>
          </div>
        ),
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
      
      const car = cars.find(c => c._id === carId);
      const verifiedCount = ['idProof','insurance','pollution','addressProof']
        .filter(key => {
          if (key === docKey) return true;
          return car.documents?.[key]?.status === 'verified';
        }).length;

      if (verifiedCount === 4) {
        try {
          const dealer = JSON.parse(localStorage.getItem('dealer'));
          // Add required fields with default values
          const pickupPayload = {
            carId: car._id,
            userId: car.owner._id || car.owner,
            dealerId: dealer._id,
            scheduledDate: new Date(), // Default to now, or set as needed
            assignedEmployee: 'Not Assigned',
            employeeContact: '',
            employeeDesignation: '',
            notes: ''
          };
          console.log('Creating pickup with payload:', pickupPayload);
          await axios.post(`http://localhost:8000/pickup/create`, pickupPayload, {
            headers: { 
              'Authorization': `Bearer ${dealerToken}`,
              'Content-Type': 'application/json'
            }
          });
          toast.success('All documents verified and pickup created successfully!');
        } catch (err) {
          console.error('Failed to create pickup:', err, err?.response?.data);
          if (err.response?.status === 401) {
            toast.error('Your session has expired. Please login again.');
            window.location.href = '/dealer_login';
            return;
          } else if (err.response?.data?.message) {
            toast.error('Failed to create pickup: ' + err.response.data.message);
          } else {
            toast.error('Failed to create pickup. Please try again.');
          }
        }
      }
      
      fetchSubmittedCars();
    } catch (err) {
      console.error('Verification error:', err);
      toast.update(toastId, {
        render: (
          <div className="flex items-center gap-2">
            <XCircle className="text-white" />
            <div>
              <p className="font-medium">Verification Failed</p>
              <p className="text-sm">{err.message || 'Failed to verify document'}</p>
            </div>
          </div>
        ),
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setVerifying(v => ({ ...v, [carId]: { ...v[carId], [docKey]: false } }));
      setProcessingDocId(null);
    }
  };

  const handleReject = async (carId, docKey) => {
    if (!rejectReason[carId]?.[docKey]) return;
    setProcessingDocId(`${carId}-${docKey}`);
    setVerifying(v => ({ ...v, [carId]: { ...v[carId], [docKey]: true } }));
    try {
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
    } finally {
      setVerifying(v => ({ ...v, [carId]: { ...v[carId], [docKey]: false } }));
      setProcessingDocId(null);
    }
  };
  const handleFinalVerification = async (carId) => {
    try {
      setVerifyingFinalMap(prev => ({ ...prev, [carId]: true }));
      const toastId = toast.loading(
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" />
          <div>
            <p className="font-medium">Marking Ready for Pickup</p>
            <p className="text-sm">Please wait...</p>
          </div>
        </div>
      );

      const dealerToken = localStorage.getItem('dealerToken');
      if (!dealerToken) {
        throw new Error('Dealer authentication required');
      }

      const response = await axios.post(`http://localhost:8000/car/mark-ready-for-pickup/${carId}`, {}, {
        headers: { Authorization: `Bearer ${dealerToken}` }
      });
      
      if (response.data.success) {
        toast.update(toastId, {
          render: (
            <div className="flex items-center gap-2">
              <CheckCircle className="text-white" />
              <div>
                <p className="font-medium">Success!</p>
                <p className="text-sm">Car marked as ready for pickup</p>
              </div>
            </div>
          ),
          type: "success",
          isLoading: false,
          autoClose: 2000
        });
        
        // Update state with readyForPickup and documentStatus
        setCars(prevCars => 
          prevCars.map(car => 
            car._id === carId 
              ? { 
                  ...car, 
                  readyForPickup: true, 
                  documentStatus: 'verified'
                }
              : car
          )
        );
      } else {
        toast.update(toastId, {
          render: "Failed to mark car as ready for pickup",
          type: "error",
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (error) {
      toast.error('An error occurred while processing your request');
      console.error('Error in final verification:', error);
    } finally {
      setVerifyingFinalMap(prev => ({ ...prev, [carId]: false }));
    }
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
        <div>
          <h1 className="text-2xl font-bold">Verify User Documents</h1>
          <p className="text-sm text-gray-600 mt-1">You can only see documents for cars where your bid has been accepted</p>
        </div>
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
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Documents to Verify</h3>
            <p className="text-gray-500">
              You'll see documents here for cars where your bid has been accepted by the owner.
            </p>
          </div>
        )}
        {filteredCars.map(car => {
          const isExpanded = expandedCar === car._id;
          const completedDocs = ['idProof','insurance','pollution','addressProof']
            .filter(docKey => car.documents?.[docKey]?.status === 'verified').length;
          const totalDocs = 4;
          const allDocsVerified = completedDocs === totalDocs;
          
          return (
            <div key={car._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
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
                </div>
                <div className="md:text-right mt-4 md:mt-0">
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
                <>
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
                                  className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 
                                             transition-colors duration-200 flex items-center gap-2 text-xs
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={processingDocId !== null}
                                  onClick={() => handleVerify(car._id, docKey)}
                                >
                                  {processingDocId === `${car._id}-${docKey}` ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Verifying...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4" />
                                      Verify
                                    </>
                                  )}
                                </button>
                                <input
                                  type="text"
                                  placeholder="Rejection reason"
                                  className="border rounded px-2 py-1.5 text-xs w-40 disabled:bg-gray-50"
                                  value={rejectReason[car._id]?.[docKey] || ''}
                                  onChange={e => setRejectReason(r => ({ ...r, [car._id]: { ...r[car._id], [docKey]: e.target.value } }))}
                                  disabled={processingDocId !== null}
                                />
                                <button
                                  className="px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 
                                             transition-colors duration-200 flex items-center gap-2 text-xs
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={processingDocId !== null || !rejectReason[car._id]?.[docKey]}
                                  onClick={() => handleReject(car._id, docKey)}
                                >
                                  {processingDocId === `${car._id}-${docKey}` ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Rejecting...
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4" />
                                      Reject
                                    </>
                                  )}
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

                  {allDocsVerified && !car.readyForPickup && car.documentStatus !== 'verified' && (
                    <div className="mt-6 border-t pt-4">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="text-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900">All Documents Verified</h3>
                          <p className="text-sm text-gray-600">You can now mark this car as ready for pickup</p>
                        </div>
                        <button
                          onClick={() => handleFinalVerification(car._id)}
                          disabled={verifyingFinalMap[car._id] || processingDocId !== null}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 
                                   transition-colors duration-200 flex items-center gap-2
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {verifyingFinalMap[car._id] ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Confirm & Mark Ready for Pickup</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {car.readyForPickup && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-green-800">Ready for Pickup</h3>
                          <p className="text-sm text-green-600">This car has been marked as ready for pickup</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
