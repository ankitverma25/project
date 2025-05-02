"use client";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function DealerLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("");
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:8000/user/login", values);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.href = "/dealer/dashboard";
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Login failed. Try again."
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
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-700 tracking-tight">Dealer Login</h2>
        <p className="text-center text-gray-500 mb-4 text-sm">Sign in to manage your scrap car bids and inventory</p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full border border-blue-200 rounded px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-400 ${formik.touched.email && formik.errors.email ? 'border-red-400' : ''}`}
          required
        />
        {formik.touched.email && formik.errors.email && <div className="text-red-500 text-xs mb-2">{formik.errors.email}</div>}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full border border-blue-200 rounded px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-400 ${formik.touched.password && formik.errors.password ? 'border-red-400' : ''}`}
          required
        />
        {formik.touched.password && formik.errors.password && <div className="text-red-500 text-xs mb-2">{formik.errors.password}</div>}
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center text-sm mt-2 text-gray-500">
          Don&apos;t have an account? <a href="/dealer/signup" className="text-blue-600 hover:underline">Sign up</a>
        </div>
      </form>
    </main>
  );
}
