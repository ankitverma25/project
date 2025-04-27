'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { Leaf, Recycle } from 'lucide-react'

const EcoImpactTracker = () => {
  const co2ChartRef = useRef(null)
  const metalChartRef = useRef(null)

  useEffect(() => {
    // CO2 Reduction Chart
    if (co2ChartRef.current) {
      const chart = echarts.init(co2ChartRef.current)
      chart.setOption({
        animation: false,
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} tons ({d}%)'
        },
        series: [{
          name: 'CO2 Reduction',
          type: 'pie',
          radius: ['50%', '70%'],
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 16, fontWeight: 'bold' }
          },
          labelLine: { show: false },
          data: [
            { value: 1.2, name: 'CO2 Reduced', itemStyle: { color: '#2E7D32' } },
            { value: 0.8, name: 'Average Reduction', itemStyle: { color: '#81C784' } }
          ]
        }]
      })
    }

    // Recycled Metal Chart
    if (metalChartRef.current) {
      const chart = echarts.init(metalChartRef.current)
      chart.setOption({
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
          type: 'value',
          name: 'Weight (kg)'
        },
        yAxis: {
          type: 'category',
          data: ['Steel', 'Aluminum', 'Copper', 'Others']
        },
        series: [{
          name: 'Recycled Metal',
          type: 'bar',
          data: [300, 80, 40, 30],
          itemStyle: { color: '#2196F3' },
          label: {
            show: true,
            position: 'right',
            formatter: '{c} kg'
          }
        }]
      })
    }
  }, [])

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Eco Impact Tracker</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <Leaf className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium">CO2 Reduction</h3>
              <p className="text-sm text-gray-500">Your environmental impact</p>
            </div>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700">1.2</div>
              <div className="text-sm text-gray-500">Tons of CO2 Reduced</div>
            </div>
          </div>
          <div ref={co2ChartRef} className="w-full h-60"></div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <Recycle className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium">Recycled Materials</h3>
              <p className="text-sm text-gray-500">Materials recovered from your vehicles</p>
            </div>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">450</div>
              <div className="text-sm text-gray-500">Total kg of Recycled Metal</div>
            </div>
          </div>
          <div ref={metalChartRef} className="w-full h-60"></div>
        </div>
      </div>
    </section>
  )
}

export default EcoImpactTracker