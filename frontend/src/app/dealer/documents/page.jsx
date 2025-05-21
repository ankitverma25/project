'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FileText, Download, CheckCircle, XCircle, AlertCircle, 
  ThumbsUp, Loader2, Search, Shield, Filter, Calendar,
  SortAsc, SortDesc, RefreshCw, Clock
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function DocumentInspectionCenter() {
  const [cars, setCars] = useState([]);
  const [verifying, setVerifying] = useState({});
  const [rejectReason, setRejectReason] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedCar, setExpandedCar] = useState(null);
  const [verifyingFinalMap, setVerifyingFinalMap] = useState({});
  const [processingDocId, setProcessingDocId] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    verified: 0,
    rejected: 0
  });
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'status'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'verified', 'rejected'
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchSubmittedCars();
  }, [refreshKey]);

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

      const carsWithReadyStatus = res.data.map(car => ({
        ...car,
        readyForPickup: car.readyForPickup || car.documentStatus === 'verified'
      }));
      
      setCars(carsWithReadyStatus);

      // Calculate document statistics
      const stats = carsWithReadyStatus.reduce((acc, car) => {
        Object.values(car.documents || {}).forEach(doc => {
          if (doc.status === 'pending') acc.pending++;
          if (doc.status === 'verified') acc.verified++;
          if (doc.status === 'rejected') acc.rejected++;
        });
        return acc;
      }, { pending: 0, verified: 0, rejected: 0 });
      
      setStats(stats);

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
          const ownerId = typeof car.owner === 'object' ? car.owner._id : car.owner;

          // Show checking pickup toast
          const pickupCheckToastId = toast.loading(
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              <div>
                <p className="font-medium">Checking Pickup Status</p>
                <p className="text-sm">Please wait...</p>
              </div>
            </div>
          );

          try {
            // First check if pickup already exists
            const checkPickupResponse = await axios.get(`http://localhost:8000/pickup/check/${car._id}`, {
              headers: { 
                'Authorization': `Bearer ${dealerToken}`
              }
            });

            if (checkPickupResponse.data.exists) {
              toast.dismiss(pickupCheckToastId);
              toast.info('A pickup has already been created for this car. You can manage it in the Pickups section.', {
                icon: <Clock className="w-5 h-5" />,
                duration: 5000
              });
              fetchSubmittedCars();
              return;
            }

            // If no pickup exists, show creating pickup toast
            toast.update(pickupCheckToastId, {
              render: (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  <div>
                    <p className="font-medium">Creating Pickup</p>
                    <p className="text-sm">Please wait...</p>
                  </div>
                </div>
              ),
              isLoading: true
            });

            // Create pickup
            const pickupPayload = {
              carId: car._id,
              userId: ownerId,
              dealerId: dealer._id,
              status: 'pending'
            };

            await axios.post(`http://localhost:8000/pickup/create`, pickupPayload, {
              headers: { 
                'Authorization': `Bearer ${dealerToken}`,
                'Content-Type': 'application/json'
              }
            });

            toast.dismiss(pickupCheckToastId);
            toast.success('All documents verified and pickup created successfully!', {
              icon: <CheckCircle className="w-5 h-5" />,
              duration: 5000
            });
          } catch (err) {
            toast.dismiss(pickupCheckToastId);
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

  const getDocumentLabel = (key) => {
    const labels = {
      idProof: 'Identity Proof',
      insurance: 'Insurance Document',
      pollution: 'Pollution Certificate',
      addressProof: 'Address Verification'
    };
    return labels[key] || key;
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getSortedAndFilteredCars = () => {
    let filtered = [...cars];

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(car => {
        const docStatuses = Object.values(car.documents || {}).map(doc => doc.status);
        if (filterStatus === 'pending') return docStatuses.includes('pending');
        if (filterStatus === 'verified') return docStatuses.every(status => status === 'verified');
        if (filterStatus === 'rejected') return docStatuses.includes('rejected');
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'status') {
        const getStatusWeight = (car) => {
          const hasRejected = Object.values(car.documents || {}).some(doc => doc.status === 'rejected');
          const hasPending = Object.values(car.documents || {}).some(doc => doc.status === 'pending');
          if (hasRejected) return 1;
          if (hasPending) return 2;
          return 3;
        };
        return getStatusWeight(b) - getStatusWeight(a);
      }
      return 0;
    });

    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Loading Document Center</h3>
          <p className="text-sm text-gray-500">Please wait while we fetch the documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900">{error}</h3>
          <button 
            onClick={fetchSubmittedCars}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-32">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="text-blue-600" />
                Document Inspection Center
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Verify and manage vehicle documents for accepted bids
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-700">{stats.pending}</div>
                <div className="text-sm text-blue-600">Pending</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-700">{stats.verified}</div>
                <div className="text-sm text-green-600">Verified</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-red-700">{stats.rejected}</div>
                <div className="text-sm text-red-600">Rejected</div>
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 pt-4 border-t">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cars or owners..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="status">By Status</option>
              </select>

              <button
                onClick={handleRefresh}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {getSortedAndFilteredCars().length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Documents Found</h3>
            <p className="text-gray-500">
              {search ? 
                `No results found for "${search}". Try a different search term.` :
                filterStatus !== 'all' ?
                `No documents found with status: ${filterStatus}` :
                "You'll see documents here for cars where your bid has been accepted by the owner."}
            </p>
          </div>
        )}

        {/* Document Cards */}
        {getSortedAndFilteredCars().map(car => {
          const isExpanded = expandedCar === car._id;
          const completedDocs = ['idProof','insurance','pollution','addressProof']
            .filter(docKey => car.documents?.[docKey]?.status === 'verified').length;
          const totalDocs = 4;
          const allDocsVerified = completedDocs === totalDocs;
          const hasRejected = Object.values(car.documents || {}).some(doc => doc.status === 'rejected');
          const statusColor = hasRejected ? 'red' : allDocsVerified ? 'green' : 'yellow';
          
          return (
            <div key={car._id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              {/* Card Header */}
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <FileText className={`text-${statusColor}-400`} size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {car.model}
                      </h3>
                      <span className="text-sm text-gray-500">({car.year})</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <div>Owner: {car.owner?.name || 'Unknown'}</div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(car.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-${statusColor}-600`}
                        style={{ width: `${(completedDocs / totalDocs) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{completedDocs}/{totalDocs}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs
                        ${hasRejected ? 'bg-red-100 text-red-800' :
                          allDocsVerified ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'}`}
                    >
                      {hasRejected ? 'Rejected' :
                       allDocsVerified ? 'Verified' :
                       'Pending'}
                    </span>
                    <button
                      onClick={() => setExpandedCar(isExpanded ? null : car._id)}
                      className="text-blue-600 text-sm hover:text-blue-800"
                    >
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {/* Document Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {['idProof', 'insurance', 'pollution', 'addressProof'].map(docKey => {
                      const doc = car.documents?.[docKey];
                      const isPending = doc?.status === 'pending';
                      const isVerified = doc?.status === 'verified';
                      const isRejected = doc?.status === 'rejected';

                      return (
                        <div key={docKey} 
                          className={`p-4 rounded-lg border ${
                            isVerified ? 'bg-green-50 border-green-100' :
                            isRejected ? 'bg-red-50 border-red-100' :
                            'bg-gray-50 border-gray-100'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FileText className={`${
                                isVerified ? 'text-green-600' :
                                isRejected ? 'text-red-600' :
                                'text-blue-600'
                              }`} size={20} />
                              <span className="font-medium">{getDocumentLabel(docKey)}</span>
                            </div>
                            {doc?.status && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                isVerified ? 'bg-green-100 text-green-800' :
                                isRejected ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {doc.status}
                              </span>
                            )}
                          </div>

                          <div className="space-y-2">
                            {doc?.url && (
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm"
                              >
                                <Download size={16} />
                                View Document
                              </a>
                            )}

                            {isPending && (
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 
                                             transition-colors duration-200 flex items-center justify-center gap-2 text-sm
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
                                  <button
                                    className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 
                                             transition-colors duration-200 flex items-center justify-center gap-2 text-sm
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
                                <input
                                  type="text"
                                  placeholder="Rejection reason (required to reject)"
                                  className="w-full border rounded px-3 py-1.5 text-sm disabled:bg-gray-50"
                                  value={rejectReason[car._id]?.[docKey] || ''}
                                  onChange={e => setRejectReason(r => ({ 
                                    ...r, 
                                    [car._id]: { ...r[car._id], [docKey]: e.target.value } 
                                  }))}
                                  disabled={processingDocId !== null}
                                />
                              </div>
                            )}

                            {isRejected && doc?.rejectionMessage && (
                              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                Rejection reason: {doc.rejectionMessage}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>                  {/* Final Verification Section */}
                  {allDocsVerified && !car.readyForPickup && car.documentStatus !== 'verified' && (
                    <div className="border-t p-4 bg-blue-50">
                      <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <ThumbsUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-blue-900">All Documents Verified</h3>
                          <p className="text-sm text-blue-700 mt-1">
                            Processing verification. Car will be available for scheduling pickup shortly.
                          </p>
                        </div>
                        <div className="animate-pulse">
                          <Loader2 className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {car.readyForPickup && (
                    <div className="border-t p-4 bg-green-50">
                      <div className="flex items-center justify-center gap-3 text-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-green-900">Ready for Pickup</h3>
                          <p className="text-sm text-green-700">
                            Vehicle has been approved and is ready for pickup
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
