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
              src="./junkcar.jpg"
              alt="Scrap car background"
              className="w-full h-full object-cover opacity-90"
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
              src="logo.jpg"
              alt="Revivo Logo"
              className="w-28 h-28 bg-white rounded-full object-contain shadow-xl"
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
                Welcome Back to Revivo!
              </h1>
              <p className="text-gray-600">
                Sell your scrap car the smart way – Get instant AI valuation, list
                for bidding, or sell car parts securely.
              </p>
            </header>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={fadeInUp} transition={{ delay: 0.6 }}>
                <FloatingLabelInput
                  id="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  autoComplete="email"
                  required
                />
              </motion.div>

              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.8 }}
                className="relative"
              >
                <FloatingLabelInput
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange("password")}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} />
                </button>
              </motion.div>

              <motion.button
                type="submit"
                variants={fadeInUp}
                transition={{ delay: 1 }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium flex items-center justify-center"
              >
                <i className="fa-solid fa-lock mr-2 text-sm" />
                Secure Login
              </motion.button>
            </form>

            {/* Secondary Actions */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 1.2 }}
              className="mt-8 text-center space-y-4 text-sm"
            >
              <p className="text-gray-600">
                New here?{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Create an Account
                </a>
              </p>
              <p className="text-gray-600">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot Password?
                </a>
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
            <a
              href="#"
              className="inline-flex items-center px-5 py-2.5 bg-white/80 hover:bg-white/95 backdrop-blur-sm rounded-lg border border-white/40 text-gray-700 hover:text-gray-900 transition-all"
            >
              <i className="fa-solid fa-headset mr-2 text-blue-600" />
              Need help? Contact Support
            </a>
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
          <nav className="flex justify-center space-x-5">
            <a
              href="#"
              className="hover:text-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook" />
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter" />
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin" />
            </a>
          </nav>
        </motion.footer>
      </div>
    </>
  );
};

export default Login;