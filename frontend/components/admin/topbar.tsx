'use client'

import { Menu } from 'lucide-react'
import { useAdminHeader } from './header-context'

interface AdminTopbarProps {
	onOpenSidebar?: () => void
}

export function AdminTopbar({ onOpenSidebar }: AdminTopbarProps) {
	const { title, actions } = useAdminHeader()
	return (
		<div className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200">
			<div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 h-11">
				<button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={onOpenSidebar} aria-label="Open sidebar">
					<Menu className="h-6 w-6" />
				</button>
				<div className="min-w-0 flex-1 overflow-hidden">
					<h1 className="truncate text-base sm:text-lg font-semibold text-gray-900">{title}</h1>
				</div>
				<div className="flex-none flex items-center gap-2">
					{actions}
				</div>
			</div>
		</div>
	)
}


