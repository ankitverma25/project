'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Gavel, ArrowRight, Settings } from 'lucide-react';

const Howitwork = () => {
  const [activeTab, setActiveTab] = useState('ai');

  return (
    <div className="py-12 bg-green-300">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Sell Your Vehicle Smartly
          </h2>
          <p className="text-gray-600">
            Choose your preferred selling method in 3 simple steps
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              activeTab === 'ai'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            <Calculator size={18} />
            AI Valuation
          </button>
          
          <button
            onClick={() => setActiveTab('bidding')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              activeTab === 'bidding'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            <Gavel size={18} />
            Bidding
          </button>
          
          <button
            onClick={() => setActiveTab('parts')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              activeTab === 'parts'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            <Settings size={18} />
            Parts
          </button>
        </div>

        {/* Content */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-600"
        >
          {/* AI Valuation */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Step number={1} text="Enter your car details (Model, Year, Condition, Location)" />
                <Step number={2} text="Get an instant AI-generated scrap price based on real-time market trends" />
                <Step number={3} text="Accept the offer & schedule pickup at your convenience" />
                <Step number={4} text="Our team picks up your car, and you get paid securely" />
              </div>
              <button className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                <ArrowRight size={18} />
                Check My Scrap Value
              </button>
            </div>
          )}

          {/* Bidding System */}
          {activeTab === 'bidding' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Step number={1} text="List your car for auction by entering details & uploading photos" />
                <Step number={2} text="Verified scrap dealers place bids in real-time" />
                <Step number={3} text="You receive multiple offers & choose the highest bid" />
                <Step number={4} text="The dealer arranges pickup & payment is processed securely" />
              </div>
              <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <ArrowRight size={18} />
                Start Bidding Now
              </button>
            </div>
          )}

          {/* Parts Marketplace */}
          {activeTab === 'parts' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Step number={1} text="List your functional car parts (Battery, Engine, Tires, AC, etc.)" />
                <Step number={2} text="Garage owners & mechanics browse & make offers" />
                <Step number={3} text="You receive multiple offers & choose the highest bid" />
                <Step number={4} text="The buyer arranges pickup & payment is processed securely" />
              </div>
              <button className="w-full bg-orange-600 text-white py-2.5 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2">
                <ArrowRight size={18} />
                List Parts Now
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Reusable Step Component
const Step = ({ number, text }) => (
  <div className="flex gap-3">
    <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
      {number}
    </div>
    <p className="text-gray-600 flex-1">{text}</p>
  </div>
);

export default Howitwork;