'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Car, DollarSign, ClipboardCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDealers: 0,
    pendingDealers: 0,
    totalCars: 0,
    pendingVerifications: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    const admin = localStorage.getItem('admin');
    
    if (!token || !admin) {
      toast.error('Please login again');
      router.push('/admin_login');
      return false;
    }
    return token;
  };

  const fetchDashboardData = async () => {
    const token = checkAuth();
    if (!token) return;

    try {      // Use admin_token consistently for all admin requests
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };      const [usersRes, dealersRes, carsRes] = await Promise.all([
        axios.get('http://localhost:8000/user/allusers', { 
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:8000/dealer/all', { 
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:8000/car/allCars', { 
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setStats({
        totalUsers: usersRes.data.length || 0,
        totalDealers: dealersRes.data.length || 0,
        pendingDealers: (dealersRes.data || []).filter(d => !d.isApproved).length || 0,
        totalCars: carsRes.data.length || 0,
        pendingVerifications: (carsRes.data || []).filter(c => c.status === 'pending').length || 0
      });

      // Set recent activities based on actual data
      const activities = [];
      
      if (dealersRes.data.some(d => !d.isApproved)) {
        activities.push({ 
          type: 'dealer_approval', 
          message: 'New dealer registrations pending approval' 
        });
      }
      
      if (carsRes.data.some(c => c.status === 'pending')) {
        activities.push({ 
          type: 'car_verification', 
          message: 'Cars pending document verification' 
        });
      }

      setRecentActivities(activities);

    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        router.push('/admin_login');
      } else {
        toast.error('Error fetching dashboard data');
        console.error('Dashboard data fetch error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{loading ? '-' : value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Dealers"
          value={stats.totalDealers}
          icon={Users}
          color="bg-emerald-500"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingDealers}
          icon={AlertCircle}
          color="bg-amber-500"
        />
        <StatCard
          title="Total Cars"
          value={stats.totalCars}
          icon={Car}
          color="bg-indigo-500"
        />
        <StatCard
          title="Pending Verifications"
          value={stats.pendingVerifications}
          icon={ClipboardCheck}
          color="bg-purple-500"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                <p className="text-gray-600">{activity.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
