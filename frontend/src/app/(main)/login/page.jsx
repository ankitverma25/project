"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from 'lucide-react';
import Backbar from "@/components/Backbar";
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/user/login', {
        email: formData.email,
        password: formData.password,
      });
      // Store token and user in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Login successful!');
      // Redirect to user dashboard after successful login
      setTimeout(() => {
        router.push('/user/dashboard');
      }, 1000);
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // Animation variants for better reusability
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  return (
    <>
      <Backbar />
      <div className="min-h-screen relative overflow-hidden flex flex-col items-center px-4">
        {/* Background Section */}
        <div className="absolute inset-0 -z-20">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "linear",
            }}
            className="w-full h-full"
          >
            <img
              src="/junkcar.jpg"
              alt="Scrap car background"
              className="w-full h-full object-cover opacity-90 blur-sm"
              width={1920}
              height={1080}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/70 to-green-100/80" />
        </div>

        {/* Main Content Container */}
        <main className="w-full max-w-md z-10 mt-16">
          {/* Logo Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <img
              src="/logo.jpg"
              alt="Revivo Logo"
              className="w-28 h-28 bg-white rounded-full object-contain shadow-xl p-2"
              width={112}
              height={112}
            />
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="backdrop-blur-sm bg-white/95 p-8 rounded-2xl border border-white/40 shadow-xl"
          >
            <header className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome Back!
              </h1>
              <p className="text-gray-600">
                Log in to access your Revivo account
              </p>
            </header>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={fadeInUp} transition={{ delay: 0.6 }}>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} transition={{ delay: 0.8 }}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      autoComplete="current-password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 placeholder-gray-400"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                variants={fadeInUp}
                transition={{ delay: 1 }}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Login to Account'
                )}
              </motion.button>
            </form>

            {/* Secondary Actions */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 1.2 }}
              className="mt-8 text-center space-y-4"
            >
              <p className="text-gray-600">
                New to Revivo?{" "}
                <Link
                  href="/signup"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Create an Account
                </Link>
              </p>
              <p className="text-gray-600">
                <Link
                  href="/dealer_login"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Login as Dealer
                </Link>
              </p>
            </motion.div>
          </motion.div>

          {/* Support Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 1.4 }}
            className="mt-6 text-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 bg-white/80 hover:bg-white/95 backdrop-blur-sm rounded-lg border border-white/40 text-gray-700 hover:text-gray-900 transition-all"
            >
              Need help? Contact Support
            </Link>
          </motion.div>
        </main>

        {/* Footer */}
        <motion.footer
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 1.6 }}
          className="mt-auto py-8 text-center text-sm text-gray-600"
        >
          <p className="mb-4">© 2025 Revivo. All rights reserved.</p>
        </motion.footer>
      </div>
    </>
  );
};

export default Login;