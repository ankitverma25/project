'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  User, Phone, Mail, Building, FileCheck, X, Check, AlertCircle, 
  Search, Eye, Trash2, CheckSquare, XSquare, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageDealerPage() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://localhost:8000/dealer/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDealers(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch dealers');
      console.error('Fetch dealers error:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleApproveDealer = async (dealerId) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.patch(
        `http://localhost:8000/dealer/approve/${dealerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDealers(dealers.map(dealer => 
        dealer._id === dealerId ? { ...dealer, isApproved: true } : dealer
      ));
      toast.success('Dealer approved successfully');
    } catch (error) {
      toast.error('Failed to approve dealer');
      console.error('Approve dealer error:', error);
    }
  };

  const handleRejectDealer = async (dealerId) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(
        `http://localhost:8000/dealer/${dealerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDealers(dealers.filter(dealer => dealer._id !== dealerId));
      setShowDeleteModal(false);
      setSelectedDealer(null);
      toast.success('Dealer account deleted');
    } catch (error) {
      toast.error('Failed to delete dealer');
      console.error('Delete dealer error:', error);
    }
  };
  const filteredDealers = dealers.filter(dealer => {
    const matchesSearch = 
      dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.businessName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return !dealer.isApproved;
    if (filterStatus === 'approved') return dealer.isApproved;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Dealers</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search dealers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Dealers</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
          </select>
          <button
            onClick={fetchDealers}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDealers.map((dealer) => (
            <motion.div
              key={dealer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{dealer.name}</h3>
                    <p className="text-sm text-gray-500">{dealer.businessName}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium 
                  ${dealer.isApproved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {dealer.isApproved ? 'Approved' : 'Pending'}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{dealer.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{dealer.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileCheck className="w-4 h-4 mr-2" />
                  <span className="text-sm">License: {dealer.licenseNumber}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedDealer(dealer);
                    setShowViewModal(true);
                  }}
                  className="flex-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
                {!dealer.isApproved ? (
                  <>
                    <button
                      onClick={() => handleApproveDealer(dealer._id)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <CheckSquare className="w-4 h-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDealer(dealer);
                        setShowDeleteModal(true);
                      }}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <XSquare className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedDealer(dealer);
                      setShowDeleteModal(true);
                    }}
                    className="flex-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}      {!loading && filteredDealers.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No dealers found</h3>
          <p className="text-gray-500">
            {searchQuery
              ? `No dealers match "${searchQuery}"`
              : filterStatus === 'pending'
              ? 'No pending dealer approvals at the moment.'
              : filterStatus === 'approved'
              ? 'No approved dealers found.'
              : 'No dealers in the system.'}
          </p>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedDealer && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Dealer Details</h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedDealer(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1 text-gray-900">{selectedDealer.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Business Name</label>
                <p className="mt-1 text-gray-900">{selectedDealer.businessName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-gray-900">{selectedDealer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <p className="mt-1 text-gray-900">{selectedDealer.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">License Number</label>
                <p className="mt-1 text-gray-900">{selectedDealer.licenseNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <p className={`mt-1 ${
                  selectedDealer.isApproved ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {selectedDealer.isApproved ? 'Approved' : 'Pending Approval'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Joined On</label>
                <p className="mt-1 text-gray-900">
                  {new Date(selectedDealer.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete/Reject Confirmation Modal */}
      {showDeleteModal && selectedDealer && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedDealer.isApproved ? 'Remove Dealer Account' : 'Reject Dealer Application'}
              </h3>
              <p className="text-gray-500">
                {selectedDealer.isApproved
                  ? `Are you sure you want to remove ${selectedDealer.name}'s dealer account?`
                  : `Are you sure you want to reject ${selectedDealer.name}'s dealer application?`}
                This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedDealer(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectDealer(selectedDealer._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {selectedDealer.isApproved ? 'Remove Account' : 'Reject Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}