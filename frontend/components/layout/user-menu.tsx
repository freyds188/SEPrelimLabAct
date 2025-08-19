"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { getLocaleFromPathname, getLocalizedPathname } from "@/lib/i18n"

export function UserMenu() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
    const locale = getLocaleFromPathname(pathname)
    router.push(getLocalizedPathname("/", locale))
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 h-8 bg-neutral-200 rounded animate-pulse" />
        <div className="w-16 h-8 bg-neutral-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    const locale = getLocaleFromPathname(pathname)
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(getLocalizedPathname("/auth/login", locale))}
        >
          Sign in
        </Button>
        <Button
          size="sm"
          onClick={() => router.push(getLocalizedPathname("/auth/register", locale))}
        >
          Sign up
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block text-sm font-medium text-neutral-700">
          {user.name}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false)
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-neutral-200">
            <div className="px-4 py-2 text-sm text-neutral-500 border-b border-neutral-100">
              Signed in as
            </div>
            <div className="px-4 py-2 text-sm font-medium text-neutral-900">
              {user.email}
            </div>
            <div className="border-t border-neutral-100">
              <button
                onClick={handleLogout}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleLogout()
                  }
                }}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
