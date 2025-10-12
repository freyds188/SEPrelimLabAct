'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

interface SiteChromeProps {
	children: ReactNode
}

export function SiteChrome({ children }: SiteChromeProps) {
	const pathname = usePathname() || '/'
	const segments = pathname.split('/').filter(Boolean)
	const first = segments[0]
	const second = segments[1]
	const isAdminRoute = first === 'admin' || second === 'admin'
	const isSellerRoute = first === 'seller' || second === 'seller'


	if (isAdminRoute || isSellerRoute) {
		return (
			<main id="main-content" className="flex-1" role="main" tabIndex={-1}>
				{children}
			</main>
		)
	}

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main id="main-content" className="flex-1" role="main" tabIndex={-1}>
				{children}
			</main>
			<Footer />
		</div>
	)
}


