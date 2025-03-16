'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Leaf,
  DollarSign,
  Clock,
  Quote,
  CheckCircle,
} from 'lucide-react';
import FloatingLabelInput from "@/components/FloatingLabelInput";

const Sign = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="text-green-600">Revivo</span> Car Scrapping
          </h1>
          <p className="text-xl text-gray-600">
            Transform Your Old Vehicle into a Sustainable Future
          </p>
        </motion.div>

        <div className="flex flex-wrap-reverse -mx-4 gap-2">
          {/* Right Column - Form (Moved Up) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 px-4 order-2 lg:order-1"
          >
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Create Your Account
              </h2>
              <form className="space-y-6">
                {/* Form Fields */}
                {[
                  { id: 'fullName', label: 'Full Name', type: 'text', name: 'fullName' },
                  { id: 'email', label: 'Email Address', type: 'email', name: 'email' },
                  { id: 'phone', label: 'Phone Number', type: 'tel', name: 'phone' },
                  { id: 'password', label: 'Password', type: 'password', name: 'password' },
                  {
                    id: 'confirmPassword',
                    label: 'Confirm Password',
                    type: 'password',
                    name: 'confirmPassword',
                  },
                ].map((field) => (
                  <FloatingLabelInput
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                  />
                ))}
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Create Account
                </button>
              </form>
              <div className="mt-6 text-center text-gray-600">
                <p>By signing up, you agree to our</p>
                <div className="mt-2">
                  <a
                    href="#"
                    className="text-green-600 hover:text-green-700 cursor-pointer"
                  >
                    Terms of Service
                  </a>
                  <span className="mx-2">and</span>
                  <a
                    href="#"
                    className="text-green-600 hover:text-green-700 cursor-pointer"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Left Column - Image and Stats (Moved Down) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0 order-1 lg:order-2"
          >
            <div className="rounded-xl overflow-hidden shadow-2xl mb-8">
              <img
                src="/junkcar.jpg"
                alt="Car Recycling Process"
                className="w-full h-[400px] object-cover object-center"
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Quote className="text-3xl text-green-500 mr-4" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Why Choose Us?
                </h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-600">
                    We’re a new, eco-conscious startup dedicated to making car
                    scrapping simple, sustainable, and rewarding. Join us in
                    building a greener future!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Why Choose Revivo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-10 h-10 text-green-600 mb-4" />,
                title: 'Secure Process',
                description: 'Your data is protected',
              },
              {
                icon: <Leaf className="w-10 h-10 text-green-600 mb-4" />,
                title: 'Eco-Friendly',
                description: 'Sustainable recycling',
              },
              {
                icon: <DollarSign className="w-10 h-10 text-green-600 mb-4" />,
                title: 'Best Value',
                description: 'Competitive pricing',
              },
              {
                icon: <Clock className="w-10 h-10 text-green-600 mb-4" />,
                title: 'Quick Process',
                description: '24-hour service',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center bg-white rounded-xl p-6 shadow-lg"
              >
                {item.icon}
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {false && ( // Set to `false` for now, replace with state later
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4 mx-auto" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Registration Successful!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for joining Revivo. We'll contact you shortly to
                  proceed with your car scrapping process.
                </p>
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Close
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