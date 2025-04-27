'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { RefreshCw, ExternalLink } from 'lucide-react'

const BidComparisonChart = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

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
        data: ['ScrapDealerX', 'GreenRecycle', 'EcoScrap', 'MetalKing'],
        axisLabel: { interval: 0, rotate: 30 }
      },
      yAxis: {
        type: 'value',
        name: 'Bid Amount (₹)',
      },
      series: [{
        name: 'Bid Amount',
        type: 'bar',
        data: [25000, 22000, 20500, 23000],
        itemStyle: { color: '#2196F3' },
        label: {
          show: true,
          position: 'top',
          formatter: '₹{c}'
        }
      }]
    }

    chart.setOption(option)

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [])

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Bid Comparison</h2>
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-medium">Swift Dzire 2015</h3>
            <p className="text-sm text-gray-500">Compare dealer offers</p>
          </div>
          <div className="flex">
            <button className="text-sm text-gray-500 hover:text-gray-700 mr-4 flex items-center">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </button>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <ExternalLink className="w-4 h-4 mr-1" />
              Full Details
            </button>
          </div>
        </div>
        <div ref={chartRef} className="w-full h-80"></div>
      </div>
    </section>
  )
}

export default BidComparisonChart