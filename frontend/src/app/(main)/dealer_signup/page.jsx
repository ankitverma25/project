"use client";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DealerSignupPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      businessName: "",
      licenseNumber: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      phone: Yup.string().matches(/^\d{10}$/, "Phone must be 10 digits").required("Phone is required"),
      businessName: Yup.string().min(2, "Business name is too short").required("Business name is required"),
      licenseNumber: Yup.string().min(4, "License number is too short").required("License number is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await axios.post("http://localhost:8000/dealer/signup", values);
        toast.success("Signup successful! Wait for admin approval before logging in.");
        resetForm();
      } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed. Please try again.");
      }
      setLoading(false);
    },
  });

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-emerald-50 py-8">
      {/* Back Button */}
      <Link 
        href="/"
        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors ml-8 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 flex justify-center items-center"
      >
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 border border-gray-100"
          noValidate
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Dealer Registration
            </h2>
            <p className="text-gray-600 mb-6">
              Join our network of certified car dealers
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                  ${formik.touched.name && formik.errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {formik.touched.name && formik.errors.name && 
                <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                  ${formik.touched.email && formik.errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {formik.touched.email && formik.errors.email && 
                <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                    ${formik.touched.password && formik.errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && 
                <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                  ${formik.touched.phone && formik.errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {formik.touched.phone && formik.errors.phone && 
                <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>}
            </div>

            {/* Business Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                name="businessName"
                placeholder="Enter your business name"
                value={formik.values.businessName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                  ${formik.touched.businessName && formik.errors.businessName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {formik.touched.businessName && formik.errors.businessName && 
                <div className="text-red-500 text-xs mt-1">{formik.errors.businessName}</div>}
            </div>

            {/* License Number Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                placeholder="Enter your license number"
                value={formik.values.licenseNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                  ${formik.touched.licenseNumber && formik.errors.licenseNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {formik.touched.licenseNumber && formik.errors.licenseNumber && 
                <div className="text-red-500 text-xs mt-1">{formik.errors.licenseNumber}</div>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Create Dealer Account"
            )}
          </button>

          <div className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{" "}
            <Link href="/dealer_login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Login here
            </Link>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
