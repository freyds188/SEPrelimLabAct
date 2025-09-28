import React from 'react'

export function TableContainer({ children, title }: { children: React.ReactNode; title?: string }) {
	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			{title && (
				<div className="px-6 py-4 border-b border-gray-200">
					<h3 className="text-lg font-medium text-gray-900">{title}</h3>
				</div>
			)}
			<div className="overflow-x-auto">
				{children}
			</div>
		</div>
	)
}

export function AdminTable({ children }: { children: React.ReactNode }) {
	return (
		<table className="min-w-full divide-y divide-gray-200">
			{children}
		</table>
	)
}

export function Th({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
	return (
		<th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${onClick ? 'text-gray-500 cursor-pointer hover:bg-gray-100' : 'text-gray-500'}`} onClick={onClick}>
			<div className="flex items-center">
				{children}
			</div>
		</th>
	)
}

export function Td({ children, nowrap = true }: { children: React.ReactNode; nowrap?: boolean }) {
	return (
		<td className={`px-6 py-4 ${nowrap ? 'whitespace-nowrap' : ''}`}>{children}</td>
	)
}



