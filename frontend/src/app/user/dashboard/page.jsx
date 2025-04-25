import QuickActions from '@/components/dashboard/QuickActions'
import ActiveRequests from '@/components/dashboard/ActiveRequests'
import BidComparisonChart from '@/components/charts/BidComparisonChart'
import EcoImpactTracker from '@/components/charts/EcoImpactTracker'

export default function DashboardPage() {
  return (
    <>
      <QuickActions />
      <ActiveRequests />
      <BidComparisonChart />
      <EcoImpactTracker />
    </>
  )
}