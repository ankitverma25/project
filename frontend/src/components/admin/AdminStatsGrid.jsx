'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminStatsGrid() {
  const [stats, setStats] = useState({ users: 0, dealers: 0, cars: 0, pendingDealers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const [usersRes, dealersRes, carsRes, pendingDealersRes] = await Promise.all([
          axios.get('http://localhost:8000/user/allusers', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/dealer/pending', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/car/allCars', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/dealer/pending', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStats({
          users: usersRes.data.length,
          dealers: usersRes.data.filter(u => u.role === 'dealer').length, // fallback if you have role
          cars: carsRes.data.length,
          pendingDealers: pendingDealersRes.data.length,
        });
      } catch {
        setStats({ users: 0, dealers: 0, cars: 0, pendingDealers: 0 });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600 mb-1">{loading ? '...' : stats.users}</div>
        <div className="text-gray-600 text-sm">Total Users</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600 mb-1">{loading ? '...' : stats.dealers}</div>
        <div className="text-gray-600 text-sm">Total Dealers</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600 mb-1">{loading ? '...' : stats.cars}</div>
        <div className="text-gray-600 text-sm">Cars Recycled</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600 mb-1">{loading ? '...' : stats.pendingDealers}</div>
        <div className="text-gray-600 text-sm">Pending Dealers</div>
      </div>
    </div>
  );
}