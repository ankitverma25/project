"use client";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function DealerSignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setError("");
      setSuccess("");
      setLoading(true);
      try {
        await axios.post("http://localhost:8000/dealer/signup", values);
        setSuccess("Signup successful! Wait for admin approval before logging in.");
        resetForm();
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Signup failed. Try again."
        );
      }
      setLoading(false);
    },
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6 border border-blue-200"
        noValidate
      >
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-700 tracking-tight">Dealer Signup</h2>
        <p className="text-center text-gray-500 mb-4 text-sm">Create your dealer account to start bidding on scrap cars</p>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 ${formik.touched.name && formik.errors.name ? 'border-red-400' : ''}`}
            required
          />
          {formik.touched.name && formik.errors.name && <div className="text-red-500 text-xs">{formik.errors.name}</div>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 ${formik.touched.email && formik.errors.email ? 'border-red-400' : ''}`}
            required
          />
          {formik.touched.email && formik.errors.email && <div className="text-red-500 text-xs">{formik.errors.email}</div>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 ${formik.touched.password && formik.errors.password ? 'border-red-400' : ''}`}
            required
          />
          {formik.touched.password && formik.errors.password && <div className="text-red-500 text-xs">{formik.errors.password}</div>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 ${formik.touched.phone && formik.errors.phone ? 'border-red-400' : ''}`}
            required
          />
          {formik.touched.phone && formik.errors.phone && <div className="text-red-500 text-xs">{formik.errors.phone}</div>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formik.values.businessName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 ${formik.touched.businessName && formik.errors.businessName ? 'border-red-400' : ''}`}
            required
          />
          {formik.touched.businessName && formik.errors.businessName && <div className="text-red-500 text-xs">{formik.errors.businessName}</div>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">License Number</label>
          <input
            type="text"
            name="licenseNumber"
            placeholder="License Number"
            value={formik.values.licenseNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 ${formik.touched.licenseNumber && formik.errors.licenseNumber ? 'border-red-400' : ''}`}
            required
          />
          {formik.touched.licenseNumber && formik.errors.licenseNumber && <div className="text-red-500 text-xs">{formik.errors.licenseNumber}</div>}
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow mt-2"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <div className="text-center text-sm mt-2 text-gray-500">
          Already have an account? <a href="/main/login" className="text-blue-600 hover:underline">Login</a>
        </div>
      </form>
    </main>
  );
}
