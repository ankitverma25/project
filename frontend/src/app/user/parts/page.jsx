'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Phone, Tag, Edit, Trash2, CheckCircle, XCircle, Search, Filter, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

export default function UserPartsPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [filters, setFilters] = useState({
    condition: '',
    minPrice: '',
    maxPrice: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    partName: '',
    carModel: '',
    description: '',
    condition: 'used',
    price: '',
    isNegotiable: false,
    contactNumber: '',
    images: []
  });
  // Fetch parts on component mount
  useEffect(() => {
    fetchParts();
  }, []);    const fetchParts = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      let response;
      if (viewMode === 'my') {
        response = await axios.get('http://localhost:8000/parts/my-parts', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Use search endpoint with filters
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('query', searchTerm);
        if (filters.condition) queryParams.append('condition', filters.condition);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

        const url = queryParams.toString()
          ? `http://localhost:8000/parts/search?${queryParams.toString()}`
          : 'http://localhost:8000/parts/all';

        response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }      setParts(response.data);
    } catch (error) {
      console.error('Error fetching parts:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('userToken');
        toast.error(error.response?.data?.message || 'Session expired, please login again');
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch parts');
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        toast.error('Please login to list a part');
        window.location.href = '/login';
        return;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach(image => {
            formDataToSend.append('images', image);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axios.post('http://localhost:8000/parts/create', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Part listed successfully');
      setShowAddModal(false);
      setFormData({
        partName: '',
        carModel: '',
        description: '',
        condition: 'used',
        price: '',
        isNegotiable: false,
        contactNumber: '',
        images: []
      });
      fetchParts();
    } catch (error) {
      toast.error('Failed to list part');
      console.error('Error listing part:', error);
    }
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      images: Array.from(e.target.files)
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchParts();
    setShowFilters(false);
  };

  if (loading) return <div className="p-8 text-center">Loading parts...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Car Parts Marketplace</h1>
              <p className="text-gray-600 mt-1">Buy and sell car parts with other users</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              List New Part
            </button>
          </div>

          {/* Search and View Toggle */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search parts by name, model, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === 'all' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Parts
              </button>
              <button
                onClick={() => setViewMode('my')}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === 'my' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                My Parts
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={filters.condition}
                  onChange={e => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                  className="p-2 border rounded-lg"
                >
                  <option value="">All Conditions</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>

                <select
                  value={filters.status}
                  onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="p-2 border rounded-lg"
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>

                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="p-2 border rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="p-2 border rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Parts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : parts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No parts found</h3>            <p className="text-gray-500 mb-6">
              {viewMode === 'my' 
                ? "You haven't listed any parts yet" 
                : searchTerm 
                  ? `No parts match "${searchTerm}"`
                  : "No parts are currently listed"}
            </p>
            {viewMode === 'my' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                List Your First Part
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parts.map(part => (
              <div key={part._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Part Images */}
                <div className="aspect-video relative">
                  {part.images && part.images.length > 0 ? (
                    <img
                      src={part.images[0]}
                      alt={part.partName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      No Image                  </div>
                  )}                  <div className="absolute top-2 right-2">
                    <span 
                      className={
                        part.status === 'sold' 
                          ? 'px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'
                          : 'px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'
                      }
                    >
                      {part.status === 'sold' ? 'Sold' : 'Available'}
                    </span>
                  </div>
                </div>

                {/* Part Details */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{part.partName}</h2>
                  <p className="text-gray-600 text-sm mb-2">For {part.carModel}</p>
                  <p className="text-gray-700 mb-4">{part.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">₹{part.price}</span>
                      {part.isNegotiable && (
                        <span className="text-sm text-gray-500">(Negotiable)</span>
                      )}
                    </div>
                    {part.condition && (
                      <span className="text-sm text-gray-500">
                        Condition: {part.condition}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{part.contactNumber}</span>
                    </div>
                    {part.isOwner && (
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Part Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">List New Part</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Part Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded"
                    value={formData.partName}
                    onChange={(e) => setFormData(prev => ({ ...prev, partName: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Car Model</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded"
                    value={formData.carModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, carModel: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    required
                    className="w-full p-2 border rounded"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Condition</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.condition}
                    onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                  >
                    <option value="used">Used</option>
                    <option value="new">New</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    className="w-full p-2 border rounded"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contact Number</label>
                  <input
                    type="tel"
                    required
                    className="w-full p-2 border rounded"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="negotiable"
                    checked={formData.isNegotiable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isNegotiable: e.target.checked }))}
                  />
                  <label htmlFor="negotiable" className="text-sm">Price is negotiable</label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    List Part
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
