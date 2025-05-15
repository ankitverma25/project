'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, UserCheck, AlertCircle, Phone, MapPin, User, Car, CalendarCheck, PhoneCall, ChevronDown, Tag } from 'lucide-react';
import { toast } from 'react-toastify';

export default function DealerPickupPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    assignedEmployee: '',
    employeeContact: '', // Added employee contact
    employeeDesignation: '', // Added employee designation
    notes: '' // Added notes field
  });

  useEffect(() => {
    fetchVerifiedCars();
  }, []);
  const fetchVerifiedCars = async () => {
    try {
      const dealerToken = localStorage.getItem('dealerToken');
      const response = await axios.get('http://localhost:8000/car/verified-cars', {
        headers: { Authorization: `Bearer ${dealerToken}` }
      });

      // For each car, get its pickup details if they exist
      const carsWithPickups = await Promise.all(response.data.map(async (car) => {
        try {
          const pickupResponse = await axios.get(`http://localhost:8000/pickup/car/${car._id}`, {
            headers: { Authorization: `Bearer ${dealerToken}` }
          });
          return { ...car, pickupDetails: pickupResponse.data };
        } catch (err) {
          return { ...car, pickupDetails: null };
        }
      }));

      setCars(carsWithPickups);
    } catch (err) {
      console.error('Error fetching verified cars:', err);
      setError(err.response?.data?.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedulePickup = async (e) => {
    e.preventDefault();
    try {
      const dealerToken = localStorage.getItem('dealerToken');
      await axios.post(
        'http://localhost:8000/pickup/create',
        {
          carId: selectedCar._id,
          userId: selectedCar.owner._id,
          dealerId: JSON.parse(localStorage.getItem('dealer'))._id,
          scheduledDate: new Date(`${scheduleForm.date}T${scheduleForm.time}`),
          assignedEmployee: scheduleForm.assignedEmployee,
          employeeContact: scheduleForm.employeeContact, // Added employee contact
          employeeDesignation: scheduleForm.employeeDesignation, // Added employee designation
          notes: scheduleForm.notes // Added notes field
        },
        { headers: { Authorization: `Bearer ${dealerToken}` } }
      );
      
      toast.success('Pickup scheduled successfully!');
      setShowScheduleModal(false);
      fetchVerifiedCars();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule pickup');
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
              </div>

              {/* Suggested Dates */}
              {car.pickupDetails?.userSuggestedDates && car.pickupDetails.userSuggestedDates.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4" />
                    User's Preferred Dates
                  </h3>
                  <div className="space-y-2">
                    {car.pickupDetails.userSuggestedDates.map((date, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-blue-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  setSelectedCar(car);
                  // Pre-fill form with user's first suggested date if available
                  if (car.pickupDetails?.userSuggestedDates?.length > 0) {
                    const suggestedDate = new Date(car.pickupDetails.userSuggestedDates[0]);
                    setScheduleForm(prev => ({
                      ...prev,
                      date: suggestedDate.toISOString().split('T')[0],
                      time: suggestedDate.toTimeString().slice(0,5)
                    }));
                  }
                  setShowScheduleModal(true);
                }}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Schedule Pickup
              </button>
            </div>
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
            </div>

            <form onSubmit={handleSchedulePickup} className="space-y-6">
              {/* Date and Time Section */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Pickup Schedule
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
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Pickup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}