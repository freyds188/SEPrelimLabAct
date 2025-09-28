'use client'

interface LineChartProps {
	points: number[]
	accent?: 'blue' | 'green' | 'purple' | 'yellow' | 'red'
}

export function MiniLineChart({ points, accent = 'blue' }: LineChartProps) {
	const width = 160
	const height = 48
	const padding = 4
	const max = Math.max(1, ...points)
	const stepX = (width - padding * 2) / Math.max(1, points.length - 1)
	const path = points
		.map((p, i) => {
			const x = padding + i * stepX
			const y = height - padding - (p / max) * (height - padding * 2)
			return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
		})
		.join(' ')

	const color = {
		blue: '#2563eb',
		green: '#16a34a',
		purple: '#7c3aed',
		yellow: '#ca8a04',
		red: '#dc2626',
	}[accent]

	return (
		<svg width={width} height={height} className="overflow-visible">
			<path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
		</svg>
	)
}



