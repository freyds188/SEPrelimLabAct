"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService, type User } from './auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<any>
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<any>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  const isAuthenticated = !!user

  const refreshUser = useCallback(async () => {
    try {
      // Check if we have a token first
      const token = authService.getToken()
      if (!token) {
        setUser(null)
        return
      }

      // Try to get current user from API
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
      } else {
        // Token is invalid, clear it
        authService.removeToken()
        setUser(null)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      // Clear invalid token
      authService.removeToken()
      setUser(null)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      setUser(response.user)
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      const response = await authService.register({ name, email, password, password_confirmation })
      setUser(response.user)
      return response
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      // Clear cart from localStorage when user logs out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart')
        // Dispatch a custom event to notify cart context
        window.dispatchEvent(new CustomEvent('cartCleared'))
      }
    }
  }

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshUser()
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [refreshUser])

  // Listen for storage changes (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        if (e.newValue) {
          // Token was added, refresh user
          refreshUser()
        } else {
          // Token was removed, clear user
          setUser(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [refreshUser])

  const value: AuthContextType = {
    user,
    isLoading: isLoading || !isInitialized,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
