'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, UserCheck, AlertCircle, Phone, MapPin, User, Car, CalendarCheck, PhoneCall, ChevronDown, Tag, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

// Add axios request interceptor to handle auth token
axios.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('dealerToken');
      if (token) {
        // Always add Bearer prefix for consistency
        const formattedToken = token.replace(/^Bearer\s+/i, '');
        config.headers.Authorization = `Bearer ${formattedToken}`;
      }
      return config;
    } catch (error) {
      console.error('Error in axios interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add axios response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dealerToken');
      localStorage.removeItem('dealer');
      window.location.href = '/dealer_login';
    }
    return Promise.reject(error);
  }
);

export default function DealerPickupPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    assignedEmployee: '',
    employeeContact: '',
    employeeDesignation: '',
    notes: ''
  });
  const [completingPickup, setCompletingPickup] = useState(null);
  useEffect(() => {
    fetchVerifiedCars();
  }, []);

  // Add modal state change logging
  useEffect(() => {
    console.log('Modal state changed:', { showScheduleModal, selectedCar });
  }, [showScheduleModal, selectedCar]);const fetchVerifiedCars = async () => {
    try {
      const rawToken = localStorage.getItem('dealerToken');
      const dealer = JSON.parse(localStorage.getItem('dealer'));

      if (!rawToken || !dealer?._id) {
        console.error('Missing dealer token or ID');
        window.location.href = '/dealer_login';
        return;
      }

      const dealerToken = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;
      console.log('Fetching verified cars for dealer:', dealer._id);
      
      // Get all cars with verified documents and accepted by this dealer
      const response = await axios.get('http://localhost:8000/car/verified-cars', {
        headers: { Authorization: dealerToken }
      });

      if (!response.data) {
        console.error('No data received from API');
        setCars([]);
        return;
      }

      // Log the response for debugging
      console.log('API Response:', response.data);      console.log('API Response:', response.data);
      
      // Sort cars: Pending pickups first, then scheduled pickups
      const sortedCars = response.data.sort((a, b) => {
        // Put cars without pickup details first
        if (!a.pickupDetails && b.pickupDetails) return -1;
        if (a.pickupDetails && !b.pickupDetails) return 1;
        
        // Then sort by pickup status
        if (a.pickupDetails && b.pickupDetails) {
          if (a.pickupDetails.status === 'pending' && b.pickupDetails.status !== 'pending') return -1;
          if (a.pickupDetails.status !== 'pending' && b.pickupDetails.status === 'pending') return 1;
          // For scheduled pickups, sort by date
          if (a.pickupDetails.status === 'scheduled' && b.pickupDetails.status === 'scheduled') {
            return new Date(b.pickupDetails.scheduledDate) - new Date(a.pickupDetails.scheduledDate);
          }
        }
        return 0;
      });

      setCars(sortedCars);
    } catch (err) {
      console.error('Error fetching verified cars:', err);
      setError(err.response?.data?.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };  const handleSchedulePickup = async (e) => {
    e.preventDefault();
    console.log('Form submitted with values:', scheduleForm);
    
    if (submitting) {
      console.log('Already submitting, preventing duplicate submission');
      return;
    }
    setSubmitting(true);
    console.log('Starting pickup scheduling process...');
    
    let toastId; // Declare toastId at function scope so it's available in catch block
    
    try {
      // Form validation
      const requiredFields = {
        date: 'Pickup date',
        time: 'Pickup time',
        assignedEmployee: 'Employee name',
        employeeContact: 'Employee contact',
        employeeDesignation: 'Employee designation'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !scheduleForm[key])
        .map(([, label]) => label);

      if (missingFields.length > 0) {
        toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
        setSubmitting(false);
        return;
      }

      // Validate dealer session
      const rawToken = localStorage.getItem('dealerToken');
      let dealer;
      
      try {
        dealer = JSON.parse(localStorage.getItem('dealer'));
      } catch (parseError) {
        console.error('Error parsing dealer data:', parseError);
        toast.error('Invalid session data. Please login again.');
        setSubmitting(false);
        window.location.href = '/dealer_login';
        return;
      }

      if (!rawToken || !dealer?._id) {
        console.error('Missing dealer token or ID:', { hasToken: !!rawToken, dealer });
        toast.error('Your session has expired. Please login again.');
        setSubmitting(false);
        window.location.href = '/dealer_login';
        return;
      }

      // Format token properly
      const formattedToken = rawToken.replace(/^Bearer\s+/i, '');
      const dealerToken = `Bearer ${formattedToken}`;

      // Validate car and dealer data
      if (!selectedCar || !selectedCar.owner || !dealer) {
        toast.error('Missing car or dealer information. Please refresh the page.');
        setSubmitting(false);
        return;
      }

      // Validate date/time
      const scheduledDateTime = new Date(`${scheduleForm.date}T${scheduleForm.time}`);
      const now = new Date();
      now.setMinutes(now.getMinutes() + 1); // Add 1 minute buffer
      
      if (scheduledDateTime < now) {
        toast.error('Please select a future date and time');
        setSubmitting(false);
        return;
      }      // Validate business hours (8 AM to 6 PM)
      const hour = scheduledDateTime.getHours();
      console.log('Validating time:', { hour, scheduledTime: scheduleForm.time });
      if (hour < 8 || hour >= 18) {
        console.log('Time validation failed - outside business hours');
        toast.error('Please select a time between 8:00 AM and 6:00 PM');
        setSubmitting(false);
        return;
      }

      // Validate date range (within 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      if (scheduledDateTime > thirtyDaysFromNow) {
        toast.error('Please select a date within the next 30 days');
        setSubmitting(false);
        return;
      }

      // Validate phone number
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(scheduleForm.employeeContact.replace(/[- ]/g, ''))) {
        toast.error('Please enter a valid 10-digit phone number');
        setSubmitting(false);
        return;
      }

      // Validate car data
      if (!selectedCar._id || !selectedCar.owner) {
        console.error('Missing car data:', selectedCar);
        toast.error('Invalid car data. Please refresh the page.');
        setSubmitting(false);
        return;
      }

      const userId = typeof selectedCar.owner === 'object' ? selectedCar.owner._id : selectedCar.owner;
      
      if (!userId) {
        console.error('Invalid owner data:', selectedCar.owner);
        toast.error('Invalid owner data. Please refresh the page.');
        setSubmitting(false);
        return;
      }

      // Prepare pickup data
      const pickupData = {
        carId: selectedCar._id,
        userId,
        dealerId: dealer._id,
        scheduledDate: scheduledDateTime.toISOString(),
        assignedEmployee: scheduleForm.assignedEmployee,
        employeeContact: scheduleForm.employeeContact.replace(/[- ]/g, ''),
        employeeDesignation: scheduleForm.employeeDesignation,
        notes: scheduleForm.notes || undefined,
        reason: selectedCar.pickupDetails ? 'Rescheduled by dealer' : undefined
      };
      console.log('About to make API call with data:', { pickupData, dealer, selectedCar });
      
      // Show loading toast
      toastId = toast.loading(
        selectedCar.pickupDetails ? 'Rescheduling pickup...' : 'Scheduling pickup...'
      );      if (selectedCar.pickupDetails?._id) {
        // Update existing pickup
        console.log('Request details:', {
          url: `http://localhost:8000/pickup/schedule/${selectedCar.pickupDetails._id}`,
          method: 'PUT',
          headers: { Authorization: dealerToken },
          data: pickupData,
          selectedCar
        });
        const response = await axios.put(
          `http://localhost:8000/pickup/schedule/${selectedCar.pickupDetails._id}`,
          pickupData,
          { headers: { Authorization: `Bearer ${dealerToken}` } }
        );
        console.log('Update pickup response:', response.data);
        
        if (response.data) {
          toast.update(toastId, {
            render: 'Pickup rescheduled successfully',
            type: 'success',
            isLoading: false,
            autoClose: 3000
          });
        } else {
          throw new Error('No data received from server');
        }      } else {
        // Create new pickup
        console.log('Request details:', {
          url: 'http://localhost:8000/pickup/create',
          method: 'POST',
          headers: { Authorization: dealerToken },
          data: pickupData,
          selectedCar
        });
        const response = await axios.post(
          'http://localhost:8000/pickup/create',
          pickupData,
          { headers: { Authorization: `Bearer ${dealerToken}` } }
        );
        console.log('Create pickup response:', response.data);
        
        if (response.data) {
          toast.update(toastId, {
            render: 'Pickup scheduled successfully',
            type: 'success',
            isLoading: false,
            autoClose: 3000
          });
        } else {
          throw new Error('No data received from server');
        }
      }      await fetchVerifiedCars(); // Refresh the list first
      setShowScheduleModal(false); // Close modal after refresh

    } catch (err) {
      console.error('Pickup scheduling error:', err);
      
      // Update the loading toast to show error
      if (toastId) {
        toast.update(toastId, {
          render: err.response?.data?.message || 'Failed to schedule pickup',
          type: 'error',
          isLoading: false,
          autoClose: 5000
        });
      }

      // Log detailed error for debugging
      if (err.response) {
        console.error('Error response:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }

    } finally {
      setSubmitting(false);
    }
  };
  const handleMarkAsDone = async (pickupId) => {
    try {
      if (!pickupId) {
        toast.error('Invalid pickup selection');
        return;
      }

      const dealerToken = localStorage.getItem('dealerToken');
      if (!dealerToken) {
        toast.error('Your session has expired. Please login again.');
        window.location.href = '/dealer_login';
        return;
      }

      setCompletingPickup(pickupId);
      const toastId = toast.loading('Marking pickup as complete...');
      
      const response = await axios.post(
        `http://localhost:8000/pickup/complete/${pickupId}`,
        {},
        {
          headers: { Authorization: `Bearer ${dealerToken}` }
        }
      );

      if (response.data.success) {
        toast.update(toastId, {
          render: 'Pickup marked as completed successfully',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
        await fetchVerifiedCars(); // Refresh the list
      } else {
        toast.update(toastId, {
          render: 'Failed to mark pickup as complete',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (err) {
      console.error('Error marking pickup as done:', err);
      const errorMessage = err.response?.data?.message || 'Failed to mark pickup as done';
      toast.error(errorMessage);
    } finally {
      setCompletingPickup(null);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading verified cars...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Schedule Pickups</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {cars.map(car => (
          <div key={car._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Header Section */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{car.model}</h2>
                  <p className="text-sm text-gray-500">{car.year} Model</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Ready for Pickup
                </span>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 space-y-4">
              {/* Owner Info */}
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{car.owner.name}</p>
                  <p className="text-sm text-gray-500">{car.owner.phone}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{car.address.city}</p>
                  <p className="text-sm text-gray-500">{car.address.state}, {car.address.pincode}</p>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Vehicle Number</p>
                  <p className="text-sm text-gray-500">{car.vehicleNumber}</p>
                </div>
              </div>              {/* Pickup Details or Schedule Button */}
              {car.pickupDetails ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4" />
                      Current Pickup Schedule
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Calendar className="w-4 h-4" />
                        {car.pickupDetails.scheduledDate ? new Date(car.pickupDetails.scheduledDate).toLocaleString() : 'Not scheduled'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <UserCheck className="w-4 h-4" />
                        {car.pickupDetails.assignedEmployee || 'Not assigned'}
                      </div>
                      {car.pickupDetails.employeeContact && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Phone className="w-4 h-4" />
                          {car.pickupDetails.employeeContact}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reschedule History */}
                  {car.pickupDetails.rescheduleHistory && car.pickupDetails.rescheduleHistory.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-800 mb-2">Reschedule History</h3>
                      <div className="space-y-2">
                        {car.pickupDetails.rescheduleHistory.map((record, index) => (
                          <div key={index} className="text-sm text-gray-600 border-l-2 border-gray-300 pl-2">
                            <p>Date: {new Date(record.date).toLocaleString()}</p>
                            <p>By: {record.by === 'dealer' ? 'Dealer' : 'User'}</p>
                            {record.reason && <p>Reason: {record.reason}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg flex items-center justify-between">
                  <span className="text-yellow-800 text-sm">No pickup scheduled yet.</span>
                  <button                    onClick={() => {
                      console.log('Schedule button clicked for car:', car);
                      setSelectedCar(car);
                      setScheduleForm({
                        date: '',
                        time: '',
                        assignedEmployee: '',
                        employeeContact: '',
                        employeeDesignation: '',
                        notes: ''
                      });
                      console.log('Opening schedule modal...');
                      setShowScheduleModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Pickup
                  </button>
                </div>
              )}
            </div>

            {/* Action Button (if pickup exists, allow reschedule) */}
            {car.pickupDetails && (
              <div className="p-6 pt-0">                  <button
                    onClick={() => {
                      console.log('Reschedule button clicked for car:', car);
                      setSelectedCar(car);
                      console.log('Setting form to empty state');
                      setScheduleForm({
                        date: '',
                        time: '',
                        assignedEmployee: '',
                        employeeContact: '',
                        employeeDesignation: '',
                        notes: ''
                      });
                      console.log('Opening schedule modal...');
                      setShowScheduleModal(true);
                    }}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Reschedule Pickup
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Schedule Pickup</h2>
                {selectedCar && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedCar.model} ({selectedCar.year}) • {selectedCar.vehicleNumber}
                  </p>
                )}
              </div>
            </div>              <form 
                onSubmit={handleSchedulePickup}
                className="space-y-6">
                {/* Status Section */}
                {selectedCar?.pickupDetails && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Current Status</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedCar.pickupDetails.status === 'completed' ? 'bg-green-500' :
                        selectedCar.pickupDetails.status === 'scheduled' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`} />
                      <span className="text-sm capitalize">{selectedCar.pickupDetails.status}</span>
                    </div>
                  </div>
                )}

                {/* Date and Time Section */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    {selectedCar?.pickupDetails ? 'Reschedule Pickup' : 'Schedule Pickup'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
                      <input
                        type="date"
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        min={new Date().toISOString().split('T')[0]}
                        value={scheduleForm.date}
                        onChange={e => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Time</label>
                      <input
                        type="time"
                        required
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      value={scheduleForm.time}
                      onChange={e => setScheduleForm(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Employee Details Section */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-500" />
                  Employee Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      placeholder="Enter employee name"
                      value={scheduleForm.assignedEmployee}
                      onChange={e => setScheduleForm(prev => ({ ...prev, assignedEmployee: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Contact Number</label>
                    <input
                      type="tel"
                      required
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      placeholder="Enter employee contact number"
                      value={scheduleForm.employeeContact}
                      onChange={e => setScheduleForm(prev => ({ ...prev, employeeContact: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Designation</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      placeholder="Enter employee designation"
                      value={scheduleForm.employeeDesignation}
                      onChange={e => setScheduleForm(prev => ({ ...prev, employeeDesignation: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-500" />
                  Additional Notes
                </h3>
                <textarea
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400 min-h-[100px]"
                  placeholder="Enter any additional notes or instructions..."
                  value={scheduleForm.notes}
                  onChange={e => setScheduleForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-400"
                >
                  <Calendar className="w-4 h-4" />
                  {submitting ? 'Scheduling...' : 'Schedule Pickup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}