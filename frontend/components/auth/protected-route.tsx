"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getLocaleFromPathname, getLocalizedPathname } from '@/lib/i18n'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = "/" 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      const locale = getLocaleFromPathname(pathname)
      
      if (requireAuth && !isAuthenticated) {
        // Redirect to login if authentication is required but user is not authenticated
        router.push(getLocalizedPathname("/auth/login", locale))
      } else if (!requireAuth && isAuthenticated) {
        // Redirect to home if user is authenticated but shouldn't be on this page (e.g., login/register pages)
        router.push(getLocalizedPathname(redirectTo, locale))
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  // Show children if authentication state matches requirements
  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return <>{children}</>
  }

  // Return null while redirecting
  return null
}
