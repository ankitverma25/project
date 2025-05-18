'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Calendar, Clock, CheckCircle, X, Phone, Mail, MapPin, User, ChevronDown, Search, Bell, Filter, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const PickupPage = () => {
  // State variables
  const [pickups, setPickups] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: '',
    time: '',
    reason: ''
  });
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch pickups from backend
  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const token = localStorage.getItem('token');
        const userObj = JSON.parse(localStorage.getItem('user'));
        setUser(userObj);
        const res = await axios.get('http://localhost:8000/pickup/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPickups(res.data);
      } catch (err) {
        setError('Failed to load pickups');
      } finally {
        setLoading(false);
      }
    };
    fetchPickups();
  }, []);

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!rescheduleForm.date || !rescheduleForm.time || !rescheduleForm.reason) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const newDateTime = new Date(`${rescheduleForm.date}T${rescheduleForm.time}`);
      
      if (newDateTime < new Date()) {
        toast.error('Please select a future date and time');
        return;
      }

      await axios.put(
        `http://localhost:8000/pickup/user-reschedule/${selectedPickup._id}`,
        {
          newDates: [newDateTime.toISOString()],
          reason: rescheduleForm.reason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Reschedule request submitted');
      setShowReschedule(false);
      setRescheduleForm({ date: '', time: '', reason: '' });
      // Refresh pickups
      const res = await axios.get('http://localhost:8000/pickup/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPickups(res.data);
    } catch (err) {
      setError('Failed to reschedule pickup');
    }
  };

  // Filter logic
  const filteredPickups = pickups.filter(pickup =>
    activeFilter === 'all' || pickup.status === activeFilter
  );

  if (loading) return <div className="p-8 text-center">Loading pickups...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            <User className="inline mr-2" size={24} />
            {user?.name || 'User'}'s Pickups
          </h1>
          <p className="text-gray-600 mt-2">
            Total {filteredPickups.length} upcoming pickups
          </p>
        </div>
        {/* Filter Tabs */}
        <div className="flex gap-4 mt-4 md:mt-0">
          {['all', 'pending', 'scheduled', 'completed', 'cancelled'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeFilter === filter 
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              {filter === 'scheduled' && <CheckCircle className="mr-2" size={16} />}
              {filter === 'pending' && <Clock className="mr-2" size={16} />}
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Pickups List */}
      <div className="space-y-4">
        {filteredPickups.map((pickup) => (
          <div key={pickup._id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start">
              {/* Vehicle Details */}
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-2">
                  <Car className="text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold">{pickup.car?.model} {pickup.car?.year}</h3>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2" size={16} />
                  {pickup.scheduledDate ? new Date(pickup.scheduledDate).toLocaleDateString() : 'Not scheduled'}
                  {pickup.scheduledDate && (
                    <> | {new Date(pickup.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
                  )}
                </div>
                <div className="flex items-center mt-2 text-gray-600">
                  <MapPin className="mr-2" size={16} />
                  {pickup.car?.address?.city || 'N/A'}
                </div>
              </div>

              {/* Agent & Actions */}
              <div className="flex flex-col items-end">
                <div className="mb-4 text-right">
                  <p className="font-medium">{pickup.assignedEmployee || 'Not assigned'}</p>
                  {pickup.employeeContact && (
                    <div className="flex items-center justify-end">
                      <Phone className="mr-2" size={16} />
                      {pickup.employeeContact}
                    </div>
                  )}
                </div>
                {pickup.status === 'pending' && (
                  <button 
                    onClick={() => {
                      setSelectedPickup(pickup);
                      setShowReschedule(true);
                    }}
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Clock className="mr-2" size={16} />
                    Reschedule
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reschedule Modal */}
      {showReschedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Calendar className="mr-2" />
              Reschedule Pickup
            </h2>
            <form onSubmit={handleReschedule} className="space-y-4">
              <div>
                <label className="block mb-2">New Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border rounded"
                  value={rescheduleForm.date}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2">New Time</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded"
                  value={rescheduleForm.time}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2">Reason for Reschedule</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={rescheduleForm.reason}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReschedule(false)}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PickupPage;