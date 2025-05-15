'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Car,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Phone,
  Mail,
  MapPin,
  User,
  Filter,
  AlertCircle,
  ArrowRight,
  CalendarClock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DealerPickupPage() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [employees] = useState([
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Wilson'
  ]);

  // Form state
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    assignedEmployee: '',
    reason: ''
  });

  // Fetch pickups
  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        setError('Authentication required');
        return;
      }

      const response = await axios.get('http://localhost:8000/pickup/dealer', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data) {
        console.error('No data received from pickup API');
        throw new Error('No data received');
      }

      console.log('Pickups received:', response.data);
      setPickups(response.data);
      setError(null);
    } catch (err) {
      console.error('Pickup fetch error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load pickups';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle scheduling
  const handleSchedulePickup = async () => {
    try {
      const token = localStorage.getItem('token');
      const { date, time, assignedEmployee, reason } = scheduleForm;
      
      await axios.put(
        `http://localhost:8000/pickup/schedule/${selectedPickup._id}`,
        {
          scheduledDate: new Date(`${date}T${time}`).toISOString(),
          assignedEmployee,
          reason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Pickup scheduled successfully!');
      setShowScheduleModal(false);
      fetchPickups(); // Refresh the list
    } catch (err) {
      toast.error('Failed to schedule pickup');
    }
  };

  // Filter pickups
  const getFilteredPickups = () => {
    return pickups.filter(pickup => 
      activeFilter === 'all' || pickup.status === activeFilter
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="text-center">
        <Clock className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading pickups...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="text-center text-red-600">
        <AlertCircle className="w-10 h-10 mx-auto mb-4" />
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Car className="text-blue-600" />
            Vehicle Pickups
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and schedule vehicle pickups
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mt-4 md:mt-0">
          {['all', 'pending', 'scheduled', 'completed', 'cancelled'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeFilter === filter 
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              {filter === 'scheduled' && <CheckCircle size={16} />}
              {filter === 'pending' && <Clock size={16} />}
              {filter === 'completed' && <CheckCircle size={16} />}
              {filter === 'cancelled' && <X size={16} />}
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Pickups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredPickups().map((pickup) => (
          <div
            key={pickup._id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Status Banner */}
            <div className={`px-4 py-2 text-sm font-medium text-white ${
              pickup.status === 'pending' ? 'bg-yellow-500' :
              pickup.status === 'scheduled' ? 'bg-blue-600' :
              pickup.status === 'completed' ? 'bg-green-600' :
              'bg-red-600'
            }`}>
              {pickup.status.toUpperCase()}
            </div>

            <div className="p-6">
              {/* Car Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {pickup.car?.model} ({pickup.car?.year})
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Owner: {pickup.user?.name}
                </p>
              </div>

              {/* Dates */}
              {pickup.scheduledDate && (
                <div className="flex items-center text-gray-600 mb-3">
                  <Calendar className="mr-2" size={16} />
                  {new Date(pickup.scheduledDate).toLocaleDateString()} at{' '}
                  {new Date(pickup.scheduledDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}

              {/* Employee */}
              {pickup.assignedEmployee && (
                <div className="flex items-center text-gray-600 mb-3">
                  <User className="mr-2" size={16} />
                  {pickup.assignedEmployee}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end">
                {pickup.status === 'pending' && (
                  <button
                    onClick={() => {
                      setSelectedPickup(pickup);
                      setShowScheduleModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                  >
                    <CalendarClock size={16} />
                    Schedule Pickup
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {getFilteredPickups().length === 0 && (
        <div className="text-center py-12">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No pickups found</h3>
          <p className="text-gray-500">
            {activeFilter === 'all'
              ? "There are no pickups to display"
              : `No ${activeFilter} pickups found`}
          </p>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CalendarClock className="text-blue-600" />
                Schedule Pickup
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                    value={scheduleForm.date}
                    onChange={e => setScheduleForm(prev => ({
                      ...prev,
                      date: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-lg"
                    value={scheduleForm.time}
                    onChange={e => setScheduleForm(prev => ({
                      ...prev,
                      time: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign Employee
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={scheduleForm.assignedEmployee}
                    onChange={e => setScheduleForm(prev => ({
                      ...prev,
                      assignedEmployee: e.target.value
                    }))}
                  >
                    <option value="">Select an employee</option>
                    {employees.map(emp => (
                      <option key={emp} value={emp}>{emp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes/Reason (Optional)
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    value={scheduleForm.reason}
                    onChange={e => setScheduleForm(prev => ({
                      ...prev,
                      reason: e.target.value
                    }))}
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSchedulePickup}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!scheduleForm.date || !scheduleForm.time || !scheduleForm.assignedEmployee}
                >
                  Schedule Pickup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}