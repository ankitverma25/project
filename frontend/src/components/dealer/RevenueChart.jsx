'use client'
import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export default function RevenueChart() {
  const chartRef = useRef(null)

  useEffect(() => {
    const chart = echarts.init(chartRef.current)
    const option = {
      title: { text: 'Revenue Trend', left: 'center' },
      xAxis: { 
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },
      yAxis: { type: 'value' },
      series: [{
        data: [65000, 82000, 75000, 93000, 105000, 120000],
        type: 'line',
        smooth: true,
        itemStyle: { color: '#3b82f6' }
      }]
    }
    chart.setOption(option)
    return () => chart.dispose()
  }, [])

  return <div ref={chartRef} className="bg-white p-4 rounded-lg shadow h-96" />
}
