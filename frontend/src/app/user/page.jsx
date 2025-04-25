'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UserPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/user/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading dashboard...</p>
    </div>
  )
}