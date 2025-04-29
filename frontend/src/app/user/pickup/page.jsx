'use client';
import React, { useState } from 'react';
import { Car, Calendar, Clock, CheckCircle, X, Phone, Mail, MapPin, User, ChevronDown, Search, Bell, Filter } from 'lucide-react';

const PickupPage = () => {
  // Mock data (Baad me backend se replace karenge)
  const mockUser = { id: 1, name: "Rahul Sharma" };
  const mockPickups = [
    {
      id: 1,
      userId: 1,
      vehicle: "Honda City 2012",
      date: "2024-03-28",
      time: "10:00 AM",
      status: "confirmed",
      location: "New Delhi",
      agent: {
        name: "Rajesh Kumar",
        contact: "+91 9876543210"
      }
    },
    {
      id: 2,
      userId: 1,
      vehicle: "Swift Dzire 2015",
      date: "2024-04-02",
      time: "2:00 PM",
      status: "pending",
      location: "Mumbai",
      agent: { name: "Aarav Patel", contact: "+91 9876543211" }
    }
  ];

  // State variables
  const [pickups, setPickups] = useState(mockPickups);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter logic
  const filteredPickups = pickups.filter(pickup => 
    activeFilter === 'all' || pickup.status === activeFilter
  );

  // Reschedule handler (Mock)
  const handleReschedule = () => {
    const updatedPickups = pickups.map(pickup => 
      pickup.id === selectedPickup.id 
        ? { ...pickup, date: newDate, time: newTime }
        : pickup
    );
    setPickups(updatedPickups);
    setShowReschedule(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            <User className="inline mr-2" size={24} />
            {mockUser.name}'s Pickups
          </h1>
          <p className="text-gray-600 mt-2">
            Total {filteredPickups.length} upcoming pickups
          </p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-4 mt-4 md:mt-0">
          {['all', 'pending', 'confirmed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeFilter === filter 
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              {filter === 'confirmed' && <CheckCircle className="mr-2" size={16} />}
              {filter === 'pending' && <Clock className="mr-2" size={16} />}
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Pickups List */}
      <div className="space-y-4">
        {filteredPickups.map((pickup) => (
          <div key={pickup.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start">
              {/* Vehicle Details */}
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-2">
                  <Car className="text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold">{pickup.vehicle}</h3>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2" size={16} />
                  {pickup.date} | {pickup.time}
                </div>
                <div className="flex items-center mt-2 text-gray-600">
                  <MapPin className="mr-2" size={16} />
                  {pickup.location}
                </div>
              </div>

              {/* Agent & Actions */}
              <div className="flex flex-col items-end">
                <div className="mb-4 text-right">
                  <p className="font-medium">{pickup.agent.name}</p>
                  <div className="flex items-center justify-end">
                    <Phone className="mr-2" size={16} />
                    {pickup.agent.contact}
                  </div>
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
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2">New Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border rounded"
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-2">New Time</label>
                <select 
                  className="w-full p-2 border rounded"
                  onChange={(e) => setNewTime(e.target.value)}
                >
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="2:00 PM">2:00 PM</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReschedule(false)}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PickupPage;