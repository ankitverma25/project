'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, UserCheck, AlertCircle } from 'lucide-react';
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
      setCars(response.data);
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
          assignedEmployee: scheduleForm.assignedEmployee
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map(car => (
          <div key={car._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{car.model} ({car.year})</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Ready for Pickup
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">Owner: {car.owner.name}</p>
              <p className="text-sm text-gray-600">Location: {car.address.city}, {car.address.state}</p>
              <p className="text-sm text-gray-600">Vehicle Number: {car.vehicleNumber}</p>
            </div>

            <button
              onClick={() => {
                setSelectedCar(car);
                setShowScheduleModal(true);
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Schedule Pickup
            </button>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Schedule Pickup</h2>
            <form onSubmit={handleSchedulePickup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full p-2 border rounded"
                  min={new Date().toISOString().split('T')[0]}
                  value={scheduleForm.date}
                  onChange={e => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  required
                  className="w-full p-2 border rounded"
                  value={scheduleForm.time}
                  onChange={e => setScheduleForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Assigned Employee</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  placeholder="Enter employee name"
                  value={scheduleForm.assignedEmployee}
                  onChange={e => setScheduleForm(prev => ({ ...prev, assignedEmployee: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
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