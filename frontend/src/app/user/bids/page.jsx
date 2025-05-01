'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as echarts from "echarts";

const page = () => {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeBidFilter, setActiveBidFilter] = useState("all");
  const [sortOption, setSortOption] = useState("highest");
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedBids, setSelectedBids] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBidDetail, setSelectedBidDetail] = useState([] || null);
  const [userBids, setUserBids] = useState([]);

  // Fetch user's car details and bids
  useEffect(() => {
    let userId = '';
    if (typeof window !== 'undefined') {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        userId = user?._id || '';
      } catch {}
    }
    if (userId) {
      axios.get('http://localhost:8000/car/allCars')
        .then(res => {
          const userCars = res.data.filter(car => car.owner && (car.owner._id === userId || car.owner === userId));
          const car = userCars.length > 0 ? userCars[0] : null;
          setCar(car);
          // Fetch only bids for this car
          if (car && car._id) {
            axios.get(`http://localhost:8000/bid/car/${car._id}`)
              .then(bidRes => {
                setUserBids(bidRes.data);
              })
              .catch(() => setUserBids([]));
          } else {
            setUserBids([]);
          }
        })
        .catch(() => setError('Failed to load car details'))
        .finally(() => setLoading(false));
    } else {
      setError('User not found');
      setLoading(false);
    }
  }, []);

  // Filter bids based on selected filter
  const filteredBids = userBids.filter((bid) => {
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
    if (sortOption === "rating") return (b.dealerRating || 0) - (a.dealerRating || 0);
    return 0;
  });

  // Calculate statistics
  const highestBid = Math.max(...userBids.map((bid) => bid.amount));
  const averageBid = Math.round(
    userBids.reduce((sum, bid) => sum + bid.amount, 0) / userBids.length,
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
  useEffect(() => {
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

  if (loading) return <div className="p-8 text-center">Loading car details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!car) return <div className="p-8 text-center text-gray-500">No car found for your account.</div>;

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Vehicle details and bids */}
        <div className="lg:w-2/3">
          {/* Vehicle details card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <div className="rounded-lg overflow-hidden h-48 bg-gray-100">
                  <img
                    src={car.photos && car.photos.length > 0 ? car.photos[0] : '/car-placeholder.jpg'}
                    alt={car.model}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              <div className="md:w-2/3 md:pl-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-800">
                    {car.model} ({car.year})
                  </h2>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="font-medium capitalize">{car.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-medium">{car.mileage || 'N/A'} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium capitalize">{car.fuelType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{car.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Request Created</p>
                  <p className="font-medium">{new Date(car.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
          {/* ...existing code for bids ... */}
        </div>
        {/* ...existing code for right column ... */}
      </div>
    </main>
  );
}

export default page;