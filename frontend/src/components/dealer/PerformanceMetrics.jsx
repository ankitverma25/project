export default function PerformanceMetrics() {
    const metrics = [
      { title: 'Avg. Bid Acceptance Rate', value: '78%', change: '+5%' },
      { title: 'Inventory Turnover', value: '22 Days', change: '-2 Days' },
      { title: 'Customer Satisfaction', value: '4.8/5', change: '0.1+' }
    ]
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">{metric.title}</h3>
            <div className="flex items-baseline mt-2">
              <span className="text-2xl font-semibold">{metric.value}</span>
              <span className="ml-2 text-sm text-green-600">{metric.change}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }