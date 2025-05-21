'use client'

import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { RefreshCw, ExternalLink } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const BidComparisonChart = () => {
  const chartRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCar, setSelectedCar] = useState(null)
  const [bids, setBids] = useState([])
  const [cars, setCars] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetchUserCars()
  }, [])

  useEffect(() => {
    if (selectedCar) {
      fetchBidsForCar(selectedCar._id)
    }
  }, [selectedCar])

  useEffect(() => {
    if (chartRef.current && bids.length > 0) {
      updateChart()
    }
  }, [bids])

  const fetchUserCars = async () => {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))

      if (!token || !user) {
        router.push('/login')
        return
      }

      const response = await axios.get('http://localhost:8000/car/allCars', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data) {
        const userCars = response.data.filter(car => 
          car.owner && car.owner._id === user._id && !car.isSold
        )
        setCars(userCars)
        
        if (userCars.length > 0) {
          setSelectedCar(userCars[0])
        }
      }
    } catch (err) {
      console.error('Error fetching cars:', err)
      setError('Failed to load cars')
    }
  }

  const fetchBidsForCar = async (carId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:8000/bid/car/${carId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data) {
        setBids(response.data)
      }
    } catch (err) {
      console.error('Error fetching bids:', err)
      setError('Failed to load bids')
    } finally {
      setLoading(false)
    }
  }

  const updateChart = () => {
    const chart = echarts.init(chartRef.current)
    
    const option = {
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: bids.map(bid => bid.dealer?.name || 'Dealer'),
        axisLabel: { interval: 0, rotate: 30 }
      },
      yAxis: {
        type: 'value',
        name: 'Bid Amount (₹)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: (value) => `₹${value.toLocaleString('en-IN')}`
        }
      },
      series: [
        {
          name: 'Bid Amount',
          type: 'bar',
          data: bids.map(bid => bid.amount),
          itemStyle: {
            color: function(params) {
              const bid = bids[params.dataIndex]
              return bid.status === 'accepted' ? '#10B981' : '#60A5FA'
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params) => `₹${params.value.toLocaleString('en-IN')}`
          }
        }
      ]
    }

    chart.setOption(option)
    
    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  if (cars.length === 0) {
    return <div className="p-8 text-center text-gray-500">No cars found to compare bids</div>
  }

  return (
    <section className="bg-white rounded-lg shadow-sm mb-8">
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h3 className="font-medium">{selectedCar?.model} ({selectedCar?.year})</h3>
            <p className="text-sm text-gray-500">Compare dealer offers</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={selectedCar?._id || ''}
              onChange={(e) => {
                const car = cars.find(c => c._id === e.target.value)
                setSelectedCar(car)
              }}
            >
              {cars.map(car => (
                <option key={car._id} value={car._id}>
                  {car.model} ({car.year})
                </option>
              ))}
            </select>
            <button 
              onClick={() => fetchBidsForCar(selectedCar?._id)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-80"></div>
        )}
      </div>
    </section>
  )
}

export default BidComparisonChart