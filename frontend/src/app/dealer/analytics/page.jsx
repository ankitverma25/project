// app/dealer/analytics/page.js
import StatsGrid from '@/components/dealer/StatsGrid'
import RevenueChart from '@/components/dealer/RevenueChart'
import PerformanceMetrics from '@/components/dealer/PerformanceMetrics'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Business Analytics</h1>
      <StatsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <InventoryDistribution />
      </div>
      <PerformanceMetrics />
    </div>
  )
}

// components/dealer/RevenueChart.js

// components/dealer/InventoryDistribution.js


// components/dealer/PerformanceMetrics.js
