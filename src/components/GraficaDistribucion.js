'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORES = [
  '#6EEDB2', // marca
  '#99ffdb', // frozen-water 200
  '#b4e4b6', // light-green 200
  '#8ed791', // light-green 300
  '#bfd9d0', // muted-teal 200
  '#9fc6b9', // muted-teal 300
  '#b9dfce', // emerald-depths 200
  '#95d0b5', // emerald-depths 300
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
        <Legend
          formatter={(value) => (
            <span style={{ color: '#314158', fontSize: '12px' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}