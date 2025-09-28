'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

export interface AdminHeaderState {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  setTitle: (title: string) => void
  setSubtitle: (subtitle?: string) => void
  setActions: (actions?: React.ReactNode) => void
}

const AdminHeaderContext = createContext<AdminHeaderState | undefined>(undefined)

export function AdminHeaderProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<string>('Dashboard')
  const [subtitle, setSubtitle] = useState<string | undefined>(undefined)
  const [actions, setActions] = useState<React.ReactNode | undefined>(undefined)

  const value = useMemo<AdminHeaderState>(() => ({
    title,
    subtitle,
    actions,
    setTitle,
    setSubtitle,
    setActions,
  }), [title, subtitle, actions])

  return (
    <AdminHeaderContext.Provider value={value}>{children}</AdminHeaderContext.Provider>
  )
}

export function useAdminHeader(): AdminHeaderState {
  const ctx = useContext(AdminHeaderContext)
  if (!ctx) {
    throw new Error('useAdminHeader must be used within an AdminHeaderProvider')
  }
  return ctx
}



