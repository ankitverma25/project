'use client'
import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export default function InventoryDistribution() {
  const chartRef = useRef(null)

  useEffect(() => {
    const chart = echarts.init(chartRef.current)
    const option = {
      title: { text: 'Inventory Distribution', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '50%',
        data: [
          { value: 45, name: 'Steel' },
          { value: 25, name: 'Aluminum' },
          { value: 15, name: 'Copper' },
          { value: 15, name: 'Others' }
        ]
      }]
    }
    chart.setOption(option)
    return () => chart.dispose()
  }, [])

  return <div ref={chartRef} className="bg-white p-4 rounded-lg shadow h-96" />
}