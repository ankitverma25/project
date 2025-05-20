"use client";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";

export default function DealerLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:8000/dealer/login", values);
        localStorage.setItem("dealerToken", res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("dealer", JSON.stringify(res.data.dealer));
        toast.success("Login successful!");
        setTimeout(() => {
          router.push("/dealer/dashboard");
        }, 1000);
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed. Please check your credentials.");
      }
      setLoading(false);
    },
  });

  return (
    <main className="min-h-screen relative bg-gradient-to-br from-blue-50 to-emerald-50 py-8">
      {/* Back Button */}
      <Link 
        href="/"
        className="absolute top-8 left-8 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/logo.jpg"
              alt="Revivo Logo"
              className="w-24 h-24 object-contain bg-white rounded-full shadow-lg p-2"
            />
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl space-y-6 border border-gray-100"
            noValidate
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Dealer Login</h2>
              <p className="text-gray-600 text-sm">
                Sign in to manage your scrap car bids and inventory
              </p>
            </div>

            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                      ${formik.touched.password && formik.errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && 
                  <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
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
                'Login to Dashboard'
              )}
            </button>

            <div className="text-center text-sm space-y-2">
              <p className="text-gray-600">
                Don&apos;t have a dealer account?{" "}
                <Link href="/dealer_signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up here
                </Link>
              </p>
              <Link href="/login" className="text-gray-500 hover:text-gray-600 block">
                Login as User Instead
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
