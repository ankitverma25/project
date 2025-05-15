'use client'
import React, { useState, useEffect } from 'react'
import { Upload, FileText, CheckCircle, XCircle, Clock, Car, ChevronDown, AlertCircle, Lock, Eye } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function LegalDocumentsPage() {
  const [selectedCar, setSelectedCar] = useState(null)
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsError, setShowTermsError] = useState(false)
  const [acceptedBids, setAcceptedBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState({})
  const [localDocuments, setLocalDocuments] = useState({})
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)

  useEffect(() => {
    // Initial fetch
    fetchAcceptedBids();
  }, []);

  // Polling effect for document status updates
  useEffect(() => {
    if (selectedCar) {
      // Initial fetch on car selection
      fetchLatestStatus();
      
      // Start polling
      const interval = setInterval(fetchLatestStatus, 10000);
      
      return () => clearInterval(interval);
    }
  }, [selectedCar]);

  const fetchAcceptedBids = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8000/bid/accepted-bids', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAcceptedBids(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load accepted bids')
      setLoading(false)
    }
  }

  // Function to fetch latest document status
  const fetchLatestStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !selectedCar) return;

      const response = await axios.get('http://localhost:8000/bid/accepted-bids', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedBids = response.data;
      console.log('Fetched updated bids:', updatedBids);
      
      // Update state with latest document status
      setAcceptedBids(prev => prev.map(bid => {
        const updatedBid = updatedBids.find(u => u.carId === bid.carId);
        if (updatedBid) {
          return {
            ...bid,
            documents: updatedBid.documentsStatus || updatedBid.documents,
            documentsSubmitted: updatedBid.documentsSubmitted,
            termsAccepted: updatedBid.termsAccepted,
            documentStatus: updatedBid.documentStatus,
            verifiedDocsCount: updatedBid.verifiedDocsCount,
            totalDocsRequired: updatedBid.totalDocsRequired
          };
        }
        return bid;
      }));
    } catch (err) {
      console.error('Failed to fetch latest status:', err);
    }
  };

  const documentCategories = [
    {
      id: 'idProof',
      title: 'ID Proof',
      description: 'Government issued identification proof',
      required: true
    },
    {
      id: 'insurance',
      title: 'Insurance Document',
      description: 'Valid vehicle insurance papers',
      required: true
    },
    {
      id: 'pollution',
      title: 'Pollution Certificate',
      description: 'Valid PUC certificate',
      required: true
    },
    {
      id: 'addressProof',
      title: 'Address Proof',
      description: 'Recent address verification document',
      required: true
    }
  ]

  const getStatusIcon = (status) => {
    switch(status) {
      case 'verified':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />
      case 'pending':
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />
    }
  }

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }
  const getCompletionPercentage = (documents) => {
    if (!documents) return 0;
    const total = 4; // Total required documents
    const completed = Object.values(documents).filter(doc => doc?.status === 'verified').length;
    return Math.round((completed / total) * 100);
  }

  const getDocumentStatusColor = (doc) => {
    if (!doc?.status || doc.status === 'pending') return 'text-yellow-500';
    if (doc.status === 'verified') return 'text-green-500';
    return 'text-red-500';
  };

  const getDocumentStatusText = (doc) => {
    if (!doc?.status || doc.status === 'pending') return 'Pending Verification';
    if (doc.status === 'verified') return 'Verified';
    return doc.rejectionMessage || 'Rejected';
  };

  const handleFileUpload = async (e, categoryId) => {
    const file = e.target.files[0]
    if (!file) return

    if (currentBid?.documentsSubmitted) {
      toast.error('Documents have already been submitted. They cannot be modified.')
      return
    }

    // Store file in local state
    setSelectedFiles(prev => ({
      ...prev,
      [categoryId]: file
    }))

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setLocalDocuments(prev => ({
      ...prev,
      [categoryId]: {
        url: previewUrl,
        status: 'selected',
        uploadedAt: new Date()
      }
    }))

    toast.success(`${file.name} selected successfully`)
  }

  const handleTermsAccept = async () => {
    if (!selectedCar) return

    const loadingToast = toast.loading('Accepting terms...')
    
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:8000/car/accept-terms', 
        { carId: selectedCar },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTermsAccepted(true)
      setShowTermsError(false)
      
      // Update local state
      setAcceptedBids(prev => prev.map(bid => {
        if (bid.carId === selectedCar) {
          return {
            ...bid,
            termsAccepted: true
          }
        }
        return bid
      }))

      toast.success('Terms accepted successfully', { id: loadingToast })
    } catch (err) {
      console.error('Failed to accept terms:', err)
      toast.error('Failed to accept terms', { id: loadingToast })
    }
  }
  const handleSubmitForVerification = async () => {
    if (!selectedCar || !currentBid?.termsAccepted) {
      setShowTermsError(true);
      return;
    }
  
    // Check if documents are already submitted
    if (currentBid?.documentsSubmitted) {
      toast.error('Documents have already been submitted for this car');
      return;
    }
  
    // Check if all required documents are selected
    const missingDocs = documentCategories
      .filter(cat => cat.required)
      .filter(cat => !localDocuments[cat.id]?.url && !currentBid?.documents?.[cat.id]?.url);
  
    if (missingDocs.length > 0) {
      toast.error(`Missing required documents: ${missingDocs.map(d => d.title).join(', ')}`);
      return;
    }
  
    const loadingToast = toast.loading('Uploading and submitting documents...');
    
    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      
      // First, upload all selected files
      const uploadPromises = Object.entries(selectedFiles).map(async ([categoryId, file]) => {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('category', categoryId);
        formData.append('carId', selectedCar);
  
        const response = await axios.post(
          'http://localhost:8000/car/upload-document',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );
        return { categoryId, data: response.data };
      });
  
      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);
      
      // Update documents object with uploaded URLs
      const documents = { ...currentBid?.documents };
      uploadResults.forEach(({ categoryId, data }) => {
        documents[categoryId] = {
          url: data.car.documents[categoryId].url,
          status: 'pending',
          uploadedAt: new Date()
        };
      });
      
      // Submit all documents for verification
      await axios.post(
        'http://localhost:8000/car/submit-documents',
        { 
          carId: selectedCar,
          documents 
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
  
      // Update local state
      setAcceptedBids(prev => prev.map(bid => {
        if (bid.carId === selectedCar) {
          return {
            ...bid,
            documents,
            documentsSubmitted: true,
            documentStatus: 'verifying'
          };
        }
        return bid;
      }));
  
      // Clear selected files and update UI
      setSelectedFiles({});
      setLocalDocuments({});
      
      toast.success('All documents uploaded and submitted successfully!', { id: loadingToast });
      setShowSuccessBanner(true);
      setTimeout(() => setShowSuccessBanner(false), 5000);
    } catch (err) {
      console.error('Submission failed:', err);
      if (err.response?.data?.message?.includes('already been submitted')) {
        toast.error('Documents have already been submitted for this car', { id: loadingToast });
      } else {
        toast.error(err.response?.data?.message || 'Failed to submit documents', { id: loadingToast });
      }
    } finally {
      setUploading(false);
    }
  };
  
  // Helper: Check if all docs are verified
  const isAllDocsVerified = (currentBid) => {
    if (!currentBid?.documents) return false;
    return ['idProof','insurance','pollution','addressProof'].every(
      docKey => currentBid.documents[docKey]?.status === 'verified'
    );
  };

  if (loading) return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
    <p>Loading...</p> b
  </div>

  if (error) return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
    <p className="text-red-600">{error}</p>
  </div>

  const currentBid = acceptedBids.find(bid => bid.carId === selectedCar)
  const isDocumentsSubmitted = currentBid?.documentsSubmitted
  const isTermsAccepted = currentBid?.termsAccepted

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-32">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Legal Documents</h1>
        <p className="mt-2 text-gray-600">Upload and manage your vehicle documents for verification</p>

        {showSuccessBanner && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-green-100 border border-green-400 text-green-700 px-8 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Documents submitted successfully!</span>
            </div>
          </div>
        )}

        {/* Car Selector */}
        <div className="mt-6 relative">
          <button
            onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
            className="w-full md:w-96 bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">
                {selectedCar ? acceptedBids.find(bid => bid.carId === selectedCar)?.carName : 'Select a car'}
              </span>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isCarDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>

          
          {isCarDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full md:w-96 bg-white border border-gray-200 rounded-lg shadow-lg">
              {acceptedBids.map((bid) => (
                <button
                  key={bid.carId}
                  onClick={() => {
                    setSelectedCar(bid.carId)
                    setIsCarDropdownOpen(false)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{bid.carName}</p>
                    <p className="text-sm text-gray-500">Dealer: {bid.dealerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{bid.bidAmount}</p>
                    <p className="text-xs text-gray-500">{getCompletionPercentage(bid.documents)}% Complete</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedCar ? (
        <>
          {/* Terms and Conditions Section */}
          {!isTermsAccepted && (
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Terms & Conditions</h3>
                  <p className="mt-1 text-sm text-gray-500">Please read and accept the following terms before proceeding:</p>
                  <ul className="mt-3 list-disc list-inside text-sm text-gray-600 space-y-2">
                    <li>I confirm that I am the legal owner of this vehicle</li>
                    <li>I declare that there are no pending loans or financial obligations on this vehicle</li>
                    <li>I have the authority to transfer the ownership of this vehicle</li>
                    <li>All documents provided are genuine and legally valid</li>
                    <li>I understand that providing false information may result in legal consequences</li>
                  </ul>
                  <div className="mt-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => {
                          setTermsAccepted(e.target.checked)
                          if (e.target.checked) setShowTermsError(false)
                        }}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        I accept all the terms and conditions mentioned above
                      </span>
                    </label>
                    {showTermsError && (
                      <p className="mt-2 text-sm text-red-600">
                        Please accept the terms and conditions to proceed
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleTermsAccept}
                      disabled={!termsAccepted}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Accept Terms & Conditions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Selected Car Details */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {acceptedBids.find(bid => bid.carId === selectedCar)?.carName}
                </h2>
                <p className="text-sm text-gray-500">
                  Dealer: {acceptedBids.find(bid => bid.carId === selectedCar)?.dealerName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-gray-900">
                  {acceptedBids.find(bid => bid.carId === selectedCar)?.bidAmount}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${getCompletionPercentage(
                          acceptedBids.find(bid => bid.carId === selectedCar)?.documents
                        )}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getCompletionPercentage(
                      acceptedBids.find(bid => bid.carId === selectedCar)?.documents
                    )}% Complete
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentCategories.map((category) => {
              const status = currentBid?.documents?.[category.id]?.status || 'pending'
              
              return (
                <div 
                  key={category.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{category.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                        {currentBid?.documents?.[category.id] && (
                          <div className={`mt-1 text-sm ${getDocumentStatusColor(currentBid.documents[category.id])} flex items-center`}>
                            <span className="mr-1">{getDocumentStatusText(currentBid.documents[category.id])}</span>
                            {currentBid.documents[category.id]?.verifiedAt && (
                              <span className="text-gray-400 text-xs">
                                - Verified on {new Date(currentBid.documents[category.id].verifiedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {getStatusIcon(status)}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(status)}`}>
                        {(status || 'pending').charAt(0).toUpperCase() + (status || 'pending').slice(1)}
                      </span>
                      {category.required && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Required
                        </span>
                      )}
                    </div>

                    {/* Document Preview Area */}                    <div className={`border-2 border-dashed rounded-lg p-4 text-center mb-4 ${
                      isDocumentsSubmitted ? 'border-gray-300 bg-gray-50' : 'border-gray-200'
                    }`}>
                      {(currentBid?.documents?.[category.id]?.url || localDocuments[category.id]?.url) ? (
                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <FileText className={`h-12 w-12 ${
                              isDocumentsSubmitted ? 'text-gray-400' : 'text-blue-500'
                            }`} />
                            {isDocumentsSubmitted && (
                              <div className="absolute -top-2 -right-2">
                                <Lock className="h-4 w-4 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-gray-700">
                            Document uploaded
                            {isDocumentsSubmitted && ' (Locked)'}
                          </p>                          <div className="mt-2 flex items-center gap-2">
                            <a 
                              href={currentBid?.documents?.[category.id]?.url || localDocuments[category.id]?.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View Document
                            </a>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              localDocuments[category.id] ? 'bg-blue-100 text-blue-800' : getStatusBadgeColor(status)
                            }`}>
                              {localDocuments[category.id] ? 'Selected' : (status || 'pending').charAt(0).toUpperCase() + (status || 'pending').slice(1)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">No document uploaded yet</p>
                          {category.required && (
                            <p className="mt-1 text-xs text-red-500">This document is required</p>
                          )}
                        </>
                      )}
                    </div>
                    {/* Document Input */}
                    <div className="mt-4">
                      <div className="relative">
                        <input
                          type="file"
                          className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium ${
                            isDocumentsSubmitted 
                              ? 'cursor-not-allowed file:bg-gray-100 file:text-gray-500 file:cursor-not-allowed' 
                              : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                          }`}
                          onChange={(e) => handleFileUpload(e, category.id, selectedCar, currentBid?.dealerId)}
                          accept=".pdf,.jpg,.jpeg,.png"
                          disabled={uploading || isDocumentsSubmitted}
                        />
                        {isDocumentsSubmitted && (
                          <div className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Lock className="h-4 w-4" />
                              <span>Documents are locked</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {!isDocumentsSubmitted && (
                        <p className="mt-1 text-xs text-gray-500">
                          Accepted formats: PDF, JPG, JPEG, PNG
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Submit Section */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDocumentsSubmitted 
                    ? isAllDocsVerified(currentBid)
                      ? "All documents verified by dealer. Car is ready for pickup!"
                      : "Documents submitted for verification" 
                    : "Complete all required documents to proceed"}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {!isTermsAccepted 
                    ? "Please accept the terms and conditions"
                    : isDocumentsSubmitted
                    ? isAllDocsVerified(currentBid)
                      ? "Dealer has verified all your documents. Please wait for pickup scheduling."
                      : "Please wait for dealer verification"
                    : "Documents will be verified by the dealer"}
                </p>
              </div>
              <button
                onClick={handleSubmitForVerification}
                disabled={!selectedCar || !isTermsAccepted || isDocumentsSubmitted || uploading}
                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                  uploading ? 'bg-blue-400' : 'text-white bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {uploading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {uploading ? 'Uploading Documents...' : 
                 isDocumentsSubmitted ? 'Documents Submitted ✓' : 'Submit for Verification'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Select a Car</h3>
              <p className="mt-1 text-sm text-gray-500">
                Please select a car to manage its documents
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}