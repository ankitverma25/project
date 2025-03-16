'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact, Gavel, Home, Info, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
             <h1 className="text-green-700 font-extrabold  text-2xl  ">REVIVO</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-emerald-600 cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-105">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-emerald-600 cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-105">
                About Us
              </a>
              <a href="#" className="text-gray-700 hover:text-emerald-600 cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-105">
                Bidding
              </a>
              <a href="#" className="text-gray-700 hover:text-emerald-600 cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-105">
                Contact
              </a>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="px-4 py-2 rounded-3xl text-emerald-600 border border-emerald-600 hover:bg-emerald-50 cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-105">
                Log In
              </button>
              <button className="px-4 py-2 rounded-2xl bg-emerald-600 text-white  hover:bg-emerald-700 cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-105">
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-emerald-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X/> // Close icon
              ) : (
                <Menu/> // Hamburger icon
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-white z-40 md:hidden pt-16"
          >
            <div className="flex flex-col space-y-4 p-4">
              <a href="#" className="text-gray-700 hover:text-emerald-600 py-2 cursor-pointer flex items-center space-x-2">
                <Home/>
                <span>Home</span>
              </a>
              <a href="#" className="text-gray-700 hover:text-emerald-600 py-2 cursor-pointer flex items-center space-x-2">
                <Info/>
                <span>About Us</span>
              </a>
              <a href="#" className="text-gray-700 hover:text-emerald-600 py-2 cursor-pointer flex items-center space-x-2">
                <Gavel/>
                <span>Bidding</span>
              </a>
             
              <a href="#" className="text-gray-700 hover:text-emerald-600 py-2 cursor-pointer flex items-center space-x-2">
               <Contact/>
                <span>Contact</span>
              </a>
              <button className="w-full py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 cursor-pointer transition-all duration-300 hover:scale-105">
                Log In
              </button>
              <button className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-all duration-300 hover:scale-105">
                Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;