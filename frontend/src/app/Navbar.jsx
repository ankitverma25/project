'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact, Gavel, Home, Info, Menu, X } from 'lucide-react';
import Link from 'next/link';

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
              <Link href="/" className="text-gray-700 hover:text-emerald-600 cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-105">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-emerald-600 cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-105">
                About Us
              </Link>
              <a href="#" className="text-gray-700 hover:text-emerald-600 cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-105">
                Bidding
              </a>
              <Link href="/contact" className="text-gray-700 hover:text-emerald-600 cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-105">
                Contact
              </Link>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
              <button className="px-4 py-2 rounded-3xl text-emerald-600 border border-emerald-600 hover:bg-emerald-50 cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-105">
                Log In
              </button>
              </Link>
              
            <Link href="/signup">
              <button className="px-4 py-2 rounded-2xl bg-emerald-600 text-white  hover:bg-emerald-700 cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-105">
                Sign Up
              </button>
            </Link>
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
              <Link href="/" className="text-gray-700 hover:text-emerald-600 py-2 cursor-pointer flex items-center space-x-2">
                <Home/>
                <span>Home</span>
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-emerald-600 py-2 cursor-pointer flex items-center space-x-2">
                <Info/>
                <span>About Us</span>
              </Link>
              <Link href="#" className="text-gray-700 hover:text-emerald-600 py-2 cursor-pointer flex items-center space-x-2">
                <Gavel/>
                <span>Bidding</span>
              </Link>
             
              <Link href="/contact" className="text-gray-700 hover:text-emerald-600 py-2 cursor-pointer flex items-center space-x-2">
               <Contact/>
                <span>Contact</span>
              </Link>
              <Link href='/login'><button className="w-full py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 cursor-pointer transition-all duration-300 hover:scale-105">
                Log In
              </button></Link>
              <Link href="/signup">
              <button className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-all duration-300 hover:scale-105">
                Sign Up
              </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;