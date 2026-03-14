'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORES = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
]

export default function GraficaDistribucion({ positions }) {
  const datos = positions.map((pos, i) => ({
    name: pos.symbol,
    value: pos.totalCostUSD,
    color: COLORES[i % COLORES.length]
  }))

  const formatearTooltip = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={datos}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={120}
          paddingAngle={3}
          dataKey="value"
        >
          {datos.map((entry, index) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={formatearTooltip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}