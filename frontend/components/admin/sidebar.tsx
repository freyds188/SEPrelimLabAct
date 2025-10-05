'use client'

import { useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { getLocaleFromPathname } from '@/lib/i18n'
import { LayoutDashboard, Users, Package, FileText, BarChart3, Settings, LogOut, Shield, Heart } from 'lucide-react'

interface SidebarProps {
	adminUser?: { name?: string; email?: string }
	onLogout?: () => void
}

export function AdminSidebar({ adminUser, onLogout }: SidebarProps) {
	const pathname = usePathname() || '/'
	const [collapsed, setCollapsed] = useState(false)

	const locale = getLocaleFromPathname(pathname)
	const base = `/${locale}/admin`
	const navItems = useMemo(() => [
		{ label: 'Dashboard', href: `${base}/dashboard`, icon: LayoutDashboard },
		{ label: 'Users', href: `${base}/users`, icon: Users },
		{ label: 'Products', href: `${base}/products`, icon: Package },
		{ label: 'Content', href: `${base}/content`, icon: FileText },
		{ label: 'Donations', href: `${base}/donations`, icon: Heart },
		{ label: 'Financial', href: `${base}/financial`, icon: BarChart3 },
		{ label: 'Settings', href: `${base}/settings`, icon: Settings },
	// eslint-disable-next-line react-hooks/exhaustive-deps
	], [base])

	return (
		<div className={`h-full flex flex-col bg-white border-r border-gray-200 ${collapsed ? 'w-20' : 'w-64'} transition-[width] duration-200 ease-in-out`}
			aria-label="Admin sidebar">
			{/* Brand + Collapse */}
			<div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
						<Shield className="w-5 h-5 text-white" />
					</div>
					{!collapsed && <span className="text-lg font-bold text-gray-900">Admin</span>}
				</div>
				<button
					className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
					onClick={() => setCollapsed(!collapsed)}
					aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				>
					{collapsed ? '»' : '«'}
				</button>
			</div>

			{/* Nav */}
			<nav className="flex-1 px-2 py-4 space-y-1">
				{navItems.map((item) => {
					const active = pathname.startsWith(item.href)
					const Icon = item.icon
					return (
						<a
							key={item.href}
							href={item.href}
							className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
								${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
							title={collapsed ? item.label : undefined}
						>
							<Icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
							{!collapsed && <span>{item.label}</span>}
						</a>
					)
				})}
			</nav>

			{/* Profile */}
			<div className="border-t border-gray-200 p-4">
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
						<span className="text-sm font-medium text-gray-700">
							{(adminUser?.name || 'A').slice(0, 1).toUpperCase()}
						</span>
					</div>
					<div className="min-w-0 flex-1">
						<div className="text-sm font-medium text-gray-900 truncate">{adminUser?.name || 'Admin User'}</div>
						{!collapsed && (
							<div className="text-xs text-gray-500 truncate">{adminUser?.email || 'admin@cordiweave.ph'}</div>
						)}
					</div>
					<button onClick={onLogout} className="ml-auto inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
						<LogOut className="h-4 w-4" />
						{!collapsed && <span>Sign out</span>}
					</button>
				</div>
			</div>
		</div>
	)
}


