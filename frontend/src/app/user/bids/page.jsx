'use client'
import React from 'react'
import { useState } from 'react'
import * as echarts from "echarts";


const page = () => {
  const [activeBidFilter, setActiveBidFilter] = useState("all");
  const [sortOption, setSortOption] = useState("highest");
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedBids, setSelectedBids] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBidDetail, setSelectedBidDetail] = useState([]||null);

  // Sample data for bids
  const bids = [
    {
      id: 1,
      dealerName: "EcoScrap Solutions",
      dealerRating: 4.8,
      amount: 1250,
      date: "2025-04-18",
      vehicleModel: "Toyota Camry",
      vehicleYear: 2015,
      vehicleCondition: "Good",
      status: "pending",
      location: "San Francisco, CA",
      dealerImage:
        "https://readdy.ai/api/search-image?query=professional%20business%20portrait%20of%20a%20middle%20aged%20man%20with%20short%20dark%20hair%20wearing%20a%20blue%20suit%20against%20neutral%20background%2C%20corporate%20headshot%2C%20high%20quality%2C%20realistic%2C%20professional%20lighting&width=80&height=80&seq=dealer1&orientation=squarish",
      terms:
        "Pickup within 3 days, free towing included, parts recycling guarantee",
      description:
        "We offer competitive rates for your vehicle and guarantee environmentally responsible recycling of all components.",
    },
    {
      id: 2,
      dealerName: "Green Auto Recyclers",
      dealerRating: 4.5,
      amount: 1180,
      date: "2025-04-19",
      vehicleModel: "Toyota Camry",
      vehicleYear: 2015,
      vehicleCondition: "Good",
      status: "pending",
      location: "Oakland, CA",
      dealerImage:
        "https://readdy.ai/api/search-image?query=professional%20business%20portrait%20of%20a%20young%20woman%20with%20blonde%20hair%20wearing%20a%20green%20blazer%20against%20neutral%20background%2C%20corporate%20headshot%2C%20high%20quality%2C%20realistic%2C%20professional%20lighting&width=80&height=80&seq=dealer2&orientation=squarish",
      terms: "Same-day pickup available, documentation handling included",
      description:
        "Our team specializes in responsible vehicle recycling with a focus on environmental sustainability and fair pricing.",
    },
    {
      id: 3,
      dealerName: "MetalWorth Salvage",
      dealerRating: 4.2,
      amount: 1320,
      date: "2025-04-17",
      vehicleModel: "Toyota Camry",
      vehicleYear: 2015,
      vehicleCondition: "Good",
      status: "pending",
      location: "San Jose, CA",
      dealerImage:
        "https://readdy.ai/api/search-image?query=professional%20business%20portrait%20of%20a%20middle%20aged%20woman%20with%20dark%20hair%20wearing%20a%20gray%20business%20suit%20against%20neutral%20background%2C%20corporate%20headshot%2C%20high%20quality%2C%20realistic%2C%20professional%20lighting&width=80&height=80&seq=dealer3&orientation=squarish",
      terms: "Premium offered for catalytic converter, 48-hour pickup window",
      description:
        "We specialize in extracting maximum value from end-of-life vehicles and offer some of the most competitive rates in the industry.",
    },
    {
      id: 4,
      dealerName: "AutoScrap Experts",
      dealerRating: 4.7,
      amount: 1290,
      date: "2025-04-16",
      vehicleModel: "Toyota Camry",
      vehicleYear: 2015,
      vehicleCondition: "Good",
      status: "pending",
      location: "Palo Alto, CA",
      dealerImage:
        "https://readdy.ai/api/search-image?query=professional%20business%20portrait%20of%20a%20young%20man%20with%20glasses%20wearing%20a%20brown%20suit%20against%20neutral%20background%2C%20corporate%20headshot%2C%20high%20quality%2C%20realistic%2C%20professional%20lighting&width=80&height=80&seq=dealer4&orientation=squarish",
      terms: "Bonus for complete vehicles, all paperwork handled by our team",
      description:
        "With over 15 years in the industry, we provide hassle-free vehicle scrapping services with transparent pricing.",
    },
  ];

  // Filter bids based on selected filter
  const filteredBids = bids.filter((bid) => {
    if (activeBidFilter === "all") return true;
    return bid.status === activeBidFilter;
  });

  // Sort bids based on selected option
  const sortedBids = [...filteredBids].sort((a, b) => {
    if (sortOption === "highest") return b.amount - a.amount;
    if (sortOption === "lowest") return a.amount - b.amount;
    if (sortOption === "newest")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortOption === "oldest")
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortOption === "rating") return b.dealerRating - a.dealerRating;
    return 0;
  });

  // Calculate statistics
  const highestBid = Math.max(...bids.map((bid) => bid.amount));
  const averageBid = Math.round(
    bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length,
  );

  // Toggle bid selection for comparison
  const toggleBidSelection = (id) => {
    if (selectedBids.includes(id)) {
      setSelectedBids(selectedBids.filter((bidId) => bidId !== id));
    } else {
      if (selectedBids.length < 3) {
        setSelectedBids([...selectedBids, id]);
      }
    }
  };

  // Show bid detail modal
  const showBidDetail = (id) => {
    setSelectedBidDetail(id);
    setShowDetailModal(true);
  };

  // Initialize charts after component mounts
  React.useEffect(() => {
    const chartDom = document.getElementById("dealerRatingsChart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        animation: false,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["5★", "4★", "3★", "2★", "1★"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Dealer Ratings",
            type: "bar",
            barWidth: "60%",
            data: [2, 2, 0, 0, 0],
            itemStyle: {
              color: "#10B981",
            },
          },
        ],
      };
      myChart.setOption(option);

      // Resize chart when window size changes
      window.addEventListener("resize", () => {
        myChart.resize();
      });

      return () => {
        window.removeEventListener("resize", () => {
          myChart.resize();
        });
        myChart.dispose();
      };
    }
  }, []);

  return (
    <>      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left column - Vehicle details and bids */}
      <div className="lg:w-2/3">
        {/* Vehicle details card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <div className="rounded-lg overflow-hidden h-48 bg-gray-100">
                <img
                  src="https://readdy.ai/api/search-image?query=silver%20Toyota%20Camry%20sedan%202015%20model%20in%20good%20condition%2C%20realistic%20photo%2C%20studio%20lighting%2C%20clean%20background%2C%20professional%20automotive%20photography%2C%20detailed%20side%20view&width=300&height=200&seq=car1&orientation=landscape"
                  alt="Toyota Camry 2015"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <div className="md:w-2/3 md:pl-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">
                  Toyota Camry (2015)
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  4 Active Bids
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <p className="font-medium">Good</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mileage</p>
                  <p className="font-medium">120,000 miles</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Serviced</p>
                  <p className="font-medium">January 2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">San Francisco, CA</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Request Created</p>
                <p className="font-medium">April 15, 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bids filter and sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex space-x-2 mb-3 sm:mb-0">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeBidFilter === "all" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"} cursor-pointer !rounded-button whitespace-nowrap`}
              onClick={() => setActiveBidFilter("all")}
            >
              All Bids
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeBidFilter === "pending" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"} cursor-pointer !rounded-button whitespace-nowrap`}
              onClick={() => setActiveBidFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeBidFilter === "accepted" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"} cursor-pointer !rounded-button whitespace-nowrap`}
              onClick={() => setActiveBidFilter("accepted")}
            >
              Accepted
            </button>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Sort by:</span>
            <div className="relative">
              <button
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center cursor-pointer !rounded-button whitespace-nowrap"
                onClick={() =>
                  document
                    .getElementById("sortDropdown")
                    ?.classList.toggle("hidden")
                }
              >
                {sortOption === "highest" && "Highest Price"}
                {sortOption === "lowest" && "Lowest Price"}
                {sortOption === "newest" && "Newest First"}
                {sortOption === "oldest" && "Oldest First"}
                {sortOption === "rating" && "Dealer Rating"}
                <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
              <div
                id="sortDropdown"
                className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-100"
              >
                <ul className="py-1">
                  <li
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSortOption("highest");
                      document
                        .getElementById("sortDropdown")
                        ?.classList.add("hidden");
                    }}
                  >
                    Highest Price
                  </li>
                  <li
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSortOption("lowest");
                      document
                        .getElementById("sortDropdown")
                        ?.classList.add("hidden");
                    }}
                  >
                    Lowest Price
                  </li>
                  <li
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSortOption("newest");
                      document
                        .getElementById("sortDropdown")
                        ?.classList.add("hidden");
                    }}
                  >
                    Newest First
                  </li>
                  <li
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSortOption("oldest");
                      document
                        .getElementById("sortDropdown")
                        ?.classList.add("hidden");
                    }}
                  >
                    Oldest First
                  </li>
                  <li
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSortOption("rating");
                      document
                        .getElementById("sortDropdown")
                        ?.classList.add("hidden");
                    }}
                  >
                    Dealer Rating
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Compare button */}
        {selectedBids.length > 0 && (
          <div className="mb-4 bg-blue-50 p-4 rounded-lg flex justify-between items-center">
            <div>
              <span className="text-blue-800 font-medium">
                {selectedBids.length}{" "}
                {selectedBids.length === 1 ? "bid" : "bids"} selected
              </span>
              <p className="text-sm text-blue-600">
                Select up to 3 bids to compare
              </p>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap"
              onClick={() => setShowCompareModal(true)}
            >
              Compare Bids
            </button>
          </div>
        )}

        {/* Bids list */}
        <div className="space-y-4">
          {sortedBids.map((bid) => (
            <div
              key={bid.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center">
                {/* Checkbox for comparison */}
                <div className="mr-4 mb-3 md:mb-0">
                  <input
                    type="checkbox"
                    id={`compare-${bid.id}`}
                    className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                    checked={selectedBids.includes(bid.id)}
                    onChange={() => toggleBidSelection(bid.id)}
                  />
                </div>

                {/* Dealer info */}
                <div className="flex items-center mb-3 md:mb-0 md:w-1/4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={bid.dealerImage}
                      alt={bid.dealerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800">
                      {bid.dealerName}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">
                        <i className="fas fa-star text-xs"></i>
                      </span>
                      <span className="text-sm text-gray-600">
                        {bid.dealerRating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bid details */}
                <div className="md:w-1/4 mb-3 md:mb-0">
                  <p className="text-sm text-gray-500">Bid Amount</p>
                  <p className="text-xl font-bold text-gray-800">
                    ${bid.amount}
                  </p>
                  {bid.id === 3 && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Highest Bid
                    </span>
                  )}
                </div>

                <div className="md:w-1/4 mb-3 md:mb-0">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(bid.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">{bid.location}</p>
                </div>

                {/* Actions */}
                <div className="md:w-1/4 flex flex-wrap gap-2 justify-end">
                  <button
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer !rounded-button whitespace-nowrap"
                    onClick={() => showBidDetail(bid.id)}
                  >
                    <i className="fas fa-info-circle mr-1.5"></i>
                    Details
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-comment-alt mr-1.5"></i>
                    Chat
                  </button>
                  <button className="px-3 py-1.5 bg-green-600 rounded-lg text-sm font-medium text-white hover:bg-green-700 flex items-center cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-check mr-1.5"></i>
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right column - Statistics */}
      <div className="lg:w-1/3">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Bid Statistics
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Bids</span>
              <span className="font-medium text-gray-800">
                {bids.length}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Highest Bid</span>
              <span className="font-medium text-gray-800">
                ${highestBid}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Bid</span>
              <span className="font-medium text-gray-800">
                ${averageBid}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Time Active</span>
              <span className="font-medium text-gray-800">5 days</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Dealer Ratings Distribution
            </h3>
            <div id="dealerRatingsChart" className="w-full h-48"></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-trophy mr-2"></i>
              Accept Highest Bid
            </button>

            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-envelope mr-2"></i>
              Message All Dealers
            </button>

            <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap">
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh Bids
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Bid Expiration
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <i className="fas fa-clock text-yellow-500 mr-3"></i>
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Bids expire in 3 days
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Accept a bid before April 23, 2025 to secure your deal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

{/* Compare Modal */}
{showCompareModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Compare Bids
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => setShowCompareModal(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedBids.map((bidId) => {
            const bid = bids.find((b) => b.id === bidId);
            if (!bid) return null;

            return (
              <div
                key={bid.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={bid.dealerImage}
                      alt={bid.dealerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800">
                      {bid.dealerName}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">
                        <i className="fas fa-star text-xs"></i>
                      </span>
                      <span className="text-sm text-gray-600">
                        {bid.dealerRating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Bid Amount</p>
                    <p className="text-xl font-bold text-gray-800">
                      ${bid.amount}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(bid.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{bid.location}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Terms</p>
                    <p className="text-sm">{bid.terms}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                  <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                    Chat
                  </button>
                  <button className="flex-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap">
                    Accept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
)}

{/* Bid Detail Modal */}
{showDetailModal && selectedBidDetail && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Bid Details</h2>
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => setShowDetailModal(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="p-6">
        {(() => {
          const bid = bids.find((b) => b.id === selectedBidDetail);
          if (!bid) return null;

          return (
            <div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={bid.dealerImage}
                    alt={bid.dealerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {bid.dealerName}
                  </h3>
                  <div className="flex items-center">
                    <div className="flex text-yellow-500 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star text-xs ${i < Math.floor(bid.dealerRating) ? "text-yellow-500" : "text-gray-300"}`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {bid.dealerRating} out of 5
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {bid.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Bid Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">
                        Amount Offered
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        ${bid.amount}
                      </p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">
                        Date Submitted
                      </p>
                      <p className="font-medium">
                        {new Date(bid.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">
                        {bid.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Vehicle Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Vehicle</p>
                      <p className="font-medium">
                        {bid.vehicleModel} ({bid.vehicleYear})
                      </p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="font-medium">
                        {bid.vehicleCondition}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Terms & Conditions
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm">{bid.terms}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Dealer Description
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm">{bid.description}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                  <i className="fas fa-comment-alt mr-2"></i>
                  Contact Dealer
                </button>
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 cursor-pointer !rounded-button whitespace-nowrap">
                  <i className="fas fa-times mr-2"></i>
                  Reject Bid
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap">
                  <i className="fas fa-check mr-2"></i>
                  Accept Bid
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  </div>
)}
</>
  )
}

export default page