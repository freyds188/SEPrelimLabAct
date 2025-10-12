"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SellerPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/seller/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
    </div>
  )
}


