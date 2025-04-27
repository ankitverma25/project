'use client'
import React from 'react'
import { motion } from "framer-motion";
import { useEffect } from "react";
import * as echarts from "echarts";
import{CircleCheckBig, Facebook, FacebookIcon, Instagram, Linkedin, LocateIcon, MapPin, MessageCircle, MessageSquareLock, Phone, Twitter, TwitterIcon} from 'lucide-react'
import { IconCurrentLocation } from '@tabler/icons-react';
import Navbar from '@/app/Navbar';


const About = () => {
  useEffect(() => {
    const impactChart = echarts.init(document.getElementById("impactChart"));
    const option = {
      animation: false,
      title: {
        text: "Projected Growth",
        textStyle: {
          color: "#1a365d",
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: ["2025", "2026", "2027", "2028", "2029", "2030"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Projected Vehicles",
          type: "line",
          data: [2000, 4000, 6000, 8000, 10000, 12000],
          color: "#10B981", // Green color for nature theme
          lineStyle: {
            type: "dashed",
          },
        },
      ],
    };
    impactChart.setOption(option);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      {/* Hero Section */}
      <div className="pt-14">
        <div className="relative h-[500px] overflow-hidden">
          <img
            src="/aboutbg.jpg"
            className="w-full h-full object-cover"
            alt="About Us Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl text-green-200"
              >
                <h1 className="text-5xl font-bold mb-6">
                  Revolutionizing Vehicle Recycling in India
                </h1>
                <p className="text-xl mb-8">
                  Leading the sustainable transformation of India's automotive
                  industry through innovative recycling solutions and
                  environmental stewardship.
                </p>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap">
                    Join Our Mission
                  </button>
                  <button className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer whitespace-nowrap">
                    Learn More
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Journey Section */}
      <div className="py-16 bg-green-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-green-600 max-w-2xl mx-auto">
              Launching as an innovative startup with a vision to revolutionize
              India's vehicle recycling industry through cutting-edge technology,
              sustainability practices, and unwavering commitment to environmental
              preservation.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-green-600 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">Projected Annual Capacity</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-green-600 mb-2">
                ₹20Cr+
              </div>
              <div className="text-gray-600">First Year Target</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-green-600 mb-2">5</div>
              <div className="text-gray-600">Planned Centers by 2026</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-16 bg-green-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-6">
                To establish a new standard in India's vehicle recycling ecosystem
                by introducing sustainable solutions that will benefit both the
                environment and our future customers. We're preparing to launch
                with a strong commitment to reducing carbon emissions, promoting
                circular economy, and creating value for all stakeholders.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                <CircleCheckBig color="#04c859" />     
                <span>Environmentally conscious recycling practices</span>
                </div>
                <div className="flex items-center gap-3">
                <CircleCheckBig color="#04c859" />     
                  <span>Advanced AI-powered valuation system</span>
                </div>
                <div className="flex items-center gap-3">
                <CircleCheckBig color="#04c859" />     
                  <span>Transparent and secure transactions</span>
                </div>
              </div>
            </motion.div>
              <img
                src="/mission.jpeg"
                alt="Our Mission"
                className="rounded-lg shadow-lg w-[70%] mx-auto"
              />
          </div>
        </div>
      </div>


      {/* Our Impact Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-2xl font-bold mb-8">Our Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div
                  id="impactChart"
                  style={{ width: "100%", height: "400px" }}
                ></div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-xl font-semibold mb-4">
                    Environmental Goals
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Target CO2 Reduction</span>
                        <span className="text-green-600">15,000 tons/year</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Target Material Recovery</span>
                        <span className="text-green-600">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Target Water Conservation</span>
                        <span className="text-green-600">70%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-12">
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
                <li className="text-gray-400"><MapPin className='inline p-1'/>yaduvanshi market</li>
                <li className="text-gray-400">Uttar Pradesh, 226028</li>
                <li className="text-gray-400"><Phone className='inline p-1'/>+91 88585 20026</li>
                <li className="text-gray-400"><MessageCircle className='inline p-1'/>ashish0026ydv@gmail.com</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <FacebookIcon/>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                <TwitterIcon/>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <Linkedin/>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                <Instagram/>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Revivo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;