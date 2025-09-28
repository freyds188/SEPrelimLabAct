'use client'

import { ReactNode } from 'react'

interface StatCardProps {
	title: string
	value: ReactNode
	icon?: React.ComponentType<{ className?: string }>
	accent?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray'
	subtitle?: string
	trendPercent?: number
}

const accentBg: Record<NonNullable<StatCardProps['accent']>, string> = {
	blue: 'bg-blue-500',
	green: 'bg-green-500',
	purple: 'bg-purple-500',
	yellow: 'bg-yellow-500',
	red: 'bg-red-500',
	gray: 'bg-gray-500',
}

export function StatCard({ title, value, icon: Icon, accent = 'blue', subtitle, trendPercent }: StatCardProps) {
	const trendPositive = typeof trendPercent === 'number' && trendPercent >= 0
	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
					<p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
					{subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
					{typeof trendPercent === 'number' && (
						<div className={`mt-3 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${trendPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
							{trendPositive ? '▲' : '▼'} {Math.abs(trendPercent)}%
						</div>
					)}
				</div>
				{Icon && (
					<div className={`p-3 rounded-full ${accentBg[accent]} shadow-sm`}>
						<Icon className="h-6 w-6 text-white" />
					</div>
				)}
			</div>
		</div>
	)
}



