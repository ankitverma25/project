"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import Backbar from "@/components/Backbar";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (<>
      <Backbar />
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center px-4">
      {/* Background Image */}
      <div className="absolute inset-0 -z-20 ">
        <motion.img
          src="./junkcar.jpg"
          alt="Background Car"
          className="w-full h-full object-cover opacity-98"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-green-200 "></div>
      </div>

      {/* Logo */}
      <motion.div
        className="mt-8 mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        >
        <img
          src="logo.jpg"
          alt="Revivo Logo"
          className="w-24 h-24 bg-white rounded-full object-contain drop-shadow-xl"
          />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="w-full max-w-md z-10 backdrop-blur-sm  p-8 rounded-2xl border border-white/40 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        >
        <h1 className="text-4xl font-bold text-center mb-3">
          Welcome Back to Revivo!
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sell your scrap car the smart way – Get instant AI valuation, list for
          bidding, or sell car parts securely.
        </p>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg mb-8 border border-white/40 hover:border-blue-200/40 duration-300"
          >
          <div className="space-y-6">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <FloatingLabelInput
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                />
            </motion.div>

            {/* Password Input */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              >
              <FloatingLabelInput
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                />
              <button
                type="button"
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                >
                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              >
              <i className="fa fa-lock mr-2"></i> Secure Login
            </motion.button>
          </div>
        </form>

        {/* Secondary Actions */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          >
          <p className="text-gray-600">
            New here?{" "}
            <a
              href="#"
              className="text-blue-600 hover:underline font-semibold"
            >
              Create an Account
            </a>
          </p>
          <p className="text-gray-600">
            Forgot Password?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Reset Here
            </a>
          </p>
        </motion.div>
      </motion.div>

      {/* Support Button */}
      <motion.div
        className="mt-8 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-lg border border-white/40 hover:bg-white/90 transition"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        >
        <i className="fa fa-headset mr-2"></i>
        Need help? Contact Support
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="mt-auto text-center text-gray-500 text-sm py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        >
        <p>© 2025 Revivo. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="hover:text-blue-600">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="hover:text-blue-600">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="hover:text-blue-600">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </motion.footer>
    </div>
        </>
  );
};

export default Login;