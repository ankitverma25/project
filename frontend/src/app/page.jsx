'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Calculator,
  Recycle,
  Shield,
  Leaf,
  DollarSign,
  Clock,
  CheckCircle,
  ShieldCheck,
  CircleDollarSign,
  Factory,
  Gauge,
  Coins,
  HandCoins,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from 'lucide-react';
import Navbar from './Navbar';
import * as echarts from "echarts";
import Howitwork from '@/components/Howitwork';
import Faqsection from '@/components/Faqsection';
import Auction from '@/components/Auction';


const Home = () => {
  useEffect(() => {
    const ecoChart = echarts.init(document.getElementById('ecoChart'));
    const option = {
      animation: false,
      title: {
        text: 'Projected Environmental Impact',
        textStyle: {
          color: '#1a365d',
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: ['2025', '2026', '2027', '2028', '2029'], // Projected years
      },
      yAxis: {
        type: 'value',
        name: 'Impact (%)',
      },
      series: [
        {
          name: 'CO2 Reduction',
          type: 'line',
          data: [0, 10, 20, 25, 30], // Projected CO2 reduction
          color: '#10B981',
        },
        {
          name: 'Materials Recycled',
          type: 'line',
          data: [0, 30, 60, 80, 90], // Projected materials recycled
          color: '#3B82F6',
        },
        {
          name: 'Energy Saved',
          type: 'line',
          data: [0, 20, 40, 45, 50], // Projected energy saved
          color: '#F59E0B',
        },
      ],
    };
    ecoChart.setOption(option);
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-8 overflow-hidden h-[120vh]">
        {/* Background 1 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        >
          <Image
            src="/bghero1.jpg"
            alt="Background 1"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </motion.div>

        {/* Background 2 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4, ease: 'easeInOut', delay: 4 }}
        >
          <Image
            src="/bghero.jpg"
            alt="Background 2"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-2xl">
            {/* Flag and Title */}
            <motion.div
              className="flex items-center gap-2 mb-4"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <Image
                src="/flag.webp"
                alt="Indian Flag"
                width={30}
                height={28}
                className="h-8"
              />
              <span className="text-white font-semibold">
                India's Premier Vehicle Scrapping Platform
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              Join India's Green Revolution in Vehicle Recycling
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mt-6 text-lg text-gray-100 max-w-xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
            >
              Support the National Vehicle Scrappage Policy and earn up to
              ₹50,000 in benefits. Together, let's build a cleaner, greener
              India while saving on new vehicle registration costs.
            </motion.p>

            {/* Statistics */}
            <motion.div
              className="mt-8 grid grid-cols-2 gap-4 max-w-md"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 2.5 }}
            >
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-emerald-400 text-2xl font-bold">2.5 Cr+</div>
                <div className="text-white text-sm">
                  End-of-Life Vehicles in India
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-emerald-400 text-2xl font-bold">25%</div>
                <div className="text-white text-sm">Reduction in Pollution</div>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="mt-10 flex gap-y-2 flex-col md:flex-row"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 3 }}
            >
              <button className="px-8 py-3 mx-auto bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 cursor-pointer whitespace-nowrap flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Calculate Benefits
              </button>
              <button className="px-8 py-3 mx-auto bg-white text-gray-900 rounded-2xl hover:bg-gray-100 cursor-pointer whitespace-nowrap flex items-center gap-2">
                <Recycle className="w-5 h-5" />
                Scrap Your Vehicle
              </button>
            </motion.div>

            {/* Footer Note */}
            <div className="mt-6 flex items-center gap-2 text-white/80 text-sm">
              <Shield className="w-4 h-4" />
              <span className="text-[9px] md:text-sm">
                Government Approved dealer || Digital Documentation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-green-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Revivo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Maximum Value */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-xl shadow-sm border border-emerald-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CircleDollarSign className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Maximum Value</h3>
              <p className="text-gray-600 leading-relaxed">
                Get up to ₹50,000 in benefits when you scrap your old vehicle.
                Our AI-powered valuation ensures the best market price.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-3" />
                  <span>Instant price quotes</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-3" />
                  <span>Competitive bidding system</span>
                </li>
              </ul>
            </div>

            {/* Hassle-Free Process */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-xl shadow-sm border border-emerald-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Hassle-Free Process
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Complete documentation and RTO formalities handled by our expert
                team. Transparent process with real-time tracking.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-3" />
                  <span>Digital documentation</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-3" />
                  <span>Free vehicle pickup</span>
                </li>
              </ul>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-xl shadow-sm border border-emerald-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Environmental Impact
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Join India's green revolution. Our eco-friendly recycling
                process ensures 95% of vehicle materials are sustainably
                recycled.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-3" />
                  <span>Certified recycling centers</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-3" />
                  <span>Zero landfill policy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <Howitwork/>

      {/* AI Valuation System */}
      <div className="bg-green-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Instant AI Scrap Valuation
              </h2>
              <p className="text-gray-600 mb-8">
                Our state-of-the-art AI system provides accurate valuations for
                your end-of-life vehicles. Get an instant estimate based on
                comprehensive market data analysis.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mr-3" />
                    <span>Real-time market data analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mr-3" />
                    <span>Considers vehicle condition & specifications</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mr-3" />
                    <span>Regional price variations factored in</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mr-3" />
                    <span>Instant valuation report generation</span>
                  </li>
                </ul>
              </div>
              <button className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Get Free Valuation
              </button>
            </div>
            <div className="relative">
              <img
                src="https://public.readdy.ai/ai/img_res/5f40b5d67ee690463689823947d04a53.jpg"
                alt="AI Valuation System"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 right-3 bg-emerald-600 text-white p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Auction/>
      <Faqsection/>

     {/* Environmental Impact Section */}
<div className="bg-green-100 py-16">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">
      Our Environmental Goals
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Graph Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div
          id="ecoChart"
          style={{ width: '100%', height: '400px' }}
        ></div>
      </div>

      {/* Targets Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-6">
          {/* CO2 Emissions Target */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Target CO2 Reduction</span>
              <span className="text-emerald-600 font-semibold">30%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full"
                style={{ width: '0%' }} // Start at 0% (new company)
              ></div>
            </div>
          </div>

          {/* Materials Recycled Target */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Target Materials Recycled</span>
              <span className="text-emerald-600 font-semibold">90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full"
                style={{ width: '0%' }} // Start at 0% (new company)
              ></div>
            </div>
          </div>

          {/* Energy Saved Target */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Target Energy Saved</span>
              <span className="text-emerald-600 font-semibold">50%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full"
                style={{ width: '0%' }} // Start at 0% (new company)
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
      {/* Footer */}
      <footer className="bg-gray-900 text-green-500 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Revivo</h3>
              <p className="text-gray-400">
                Leading the way in sustainable automotive recycling and parts
                trading.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    Current Auctions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    Sell Parts
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    Environmental Impact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">1234 Eco Drive</li>
                <li className="text-gray-400">Green City, EC 12345</li>
                <li className="text-gray-400">+1 (555) 123-4567</li>
                <li className="text-gray-400">support@revivo.com</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Revivo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;