'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Leaf, DollarSign, Clock, Quote, CheckCircle, Eye, EyeOff } from 'lucide-react';
import FloatingLabelInput from "@/components/FloatingLabelInput";
import Backbar from '@/components/Backbar';
import Link from 'next/link';
import axios from 'axios';

const Sign = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      alert('All fields are required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/user/add', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      setShowSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data.message || JSON.stringify(err.response.data));
      } else {
        alert('Signup failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Backbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            <span className="text-emerald-600">Revivo</span> Car Recycling
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your old vehicle into value while contributing to a sustainable future
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img
                src="/junkcar.jpg"
                alt="Car Recycling Process"
                className="w-full h-auto max-h-[400px] object-cover object-center"
                loading="lazy"
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-emerald-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Why Choose Revivo?
                </h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-emerald-500 pl-4">
                  <p className="text-gray-600">
                    As an eco-conscious startup, we're making car recycling simple, sustainable, and rewarding. 
                    Join our mission to reduce automotive waste and build a greener future.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Trust Indicators - Mobile */}
            <div className="lg:hidden grid grid-cols-2 gap-4">
              {[
                { icon: <ShieldCheck className="w-8 h-8" />, title: 'Secure', desc: 'Protected data' },
                { icon: <Leaf className="w-8 h-8" />, title: 'Eco-Friendly', desc: 'Sustainable' },
                { icon: <DollarSign className="w-8 h-8" />, title: 'Best Value', desc: 'Fair pricing' },
                { icon: <Clock className="w-8 h-8" />, title: 'Fast', desc: '24h service' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -2 }}
                  className="flex flex-col items-center bg-white rounded-lg p-4 shadow-md border border-gray-100"
                >
                  <div className="text-emerald-500 mb-2">{item.icon}</div>
                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Create Your Account
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { id: 'fullName', label: 'Full Name', type: 'text', name: 'fullName' },
                  { id: 'email', label: 'Email Address', type: 'email', name: 'email' },
                  { id: 'phone', label: 'Phone Number', type: 'tel', name: 'phone' },
                ].map((field) => (
                  <FloatingLabelInput
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    required
                  />
                ))}

                {/* Password with toggle */}
                <div className="relative">
                  <FloatingLabelInput
                    id="password"
                    label="Password"
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="focus:ring-2 focus:ring-emerald-500 focus:border-transparent" // Added to prevent blue highlight
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                  >
                    {passwordVisible ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Confirm Password with toggle */}
                <div className="relative">
                  <FloatingLabelInput
                    id="confirmPassword"
                    label="Confirm Password"
                    type={confirmPasswordVisible ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="focus:ring-2 focus:ring-emerald-500 focus:border-transparent" // Added to prevent blue highlight
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                    aria-label={confirmPasswordVisible ? "Hide password" : "Show password"}
                  >
                    {confirmPasswordVisible ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-6 text-center text-gray-500 text-sm">
                <p>By signing up, you agree to our</p>
                <div className="mt-1">
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Terms of Service
                  </Link>
                  <span className="mx-1">and</span>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators - Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block mt-16"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Our Commitment to You
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {[
              {
                icon: <ShieldCheck className="w-10 h-10" />,
                title: 'Secure Process',
                description: 'Bank-level encryption protects your data',
              },
              {
                icon: <Leaf className="w-10 h-10" />,
                title: 'Eco-Friendly',
                description: '95% of each vehicle recycled sustainably',
              },
              {
                icon: <DollarSign className="w-10 h-10" />,
                title: 'Best Value',
                description: 'Real-time market pricing for your vehicle',
              },
              {
                icon: <Clock className="w-10 h-10" />,
                title: 'Quick Service',
                description: 'Free pickup within 24 hours of offer',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="text-emerald-500 mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-100"
            >
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-emerald-500 mb-4 mx-auto" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Registration Successful!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for joining Revivo. We'll contact you shortly to
                  proceed with your car recycling process.
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sign;