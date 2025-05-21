// src/components/dealer/StatsGrid.js
'use client'
import { useState, useEffect } from 'react';
import { IndianRupee, Car, Clock, Award } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function StatsGrid() {
  const [stats, setStats] = useState({
    activeBids: 0,
    wonBids: 0,
    pendingPickups: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const dealerToken = localStorage.getItem('dealerToken');
      const dealer = JSON.parse(localStorage.getItem('dealer'));

      if (!dealerToken || !dealer) {
        router.push('/dealer_login');
        return;
      }

      // Get all bids data
      const response = await axios.get('http://localhost:8000/bid/all', {
        headers: { 
          'Authorization': `Bearer ${dealerToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        // Filter bids for current dealer
        const myBids = response.data.filter(bid => bid.dealer && bid.dealer._id === dealer._id);
        
        // Get won bids (either status is 'accepted' or isAccepted is true)
        const wonBids = myBids.filter(bid => bid.status === 'accepted' || bid.isAccepted === true);
        
        // Calculate total amount from won bids
        const totalWonAmount = wonBids.reduce((total, bid) => total + (Number(bid.amount) || 0), 0);
        
        // Calculate pending pickups from won bids where car is not picked up
        const pendingPickups = wonBids.filter(bid => 
          bid.car && !bid.car.readyForPickup && 
          (!bid.car.pickupStatus || bid.car.pickupStatus === 'pending')
        ).length;

        setStats({
          activeBids: myBids.filter(bid => !bid.isAccepted && bid.status !== 'accepted').length,
          wonBids: wonBids.length,
          pendingPickups,
          totalAmount: totalWonAmount
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('dealerToken');
        localStorage.removeItem('dealer');
        router.push('/dealer_login');
      }
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    { 
      title: "Active Bids", 
      value: loading ? "-" : stats.activeBids,
      icon: <Car className="h-6 w-6" />,
      change: "Current pending bids",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    { 
      title: "Won Bids", 
      value: loading ? "-" : stats.wonBids,
      icon: <Award className="h-6 w-6" />,
      change: "Successfully won bids",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    { 
      title: "Pending Pickups", 
      value: loading ? "-" : stats.pendingPickups,
      icon: <Clock className="h-6 w-6" />,
      change: "Awaiting vehicle pickup",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    { 
      title: "Total Won Amount", 
      value: loading ? "-" : `₹${stats.totalAmount.toLocaleString('en-IN')}`,
      icon: <IndianRupee className="h-6 w-6" />,
      change: "Total value of won bids",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold mt-2 text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-full ${stat.iconColor}`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}