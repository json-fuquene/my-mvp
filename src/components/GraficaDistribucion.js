'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORES = [
  '#6EEDB2', // menta marca
  '#A8D8EA', // azul pastel
  '#FFD6A5', // naranja pastel
  '#FDFFB6', // amarillo pastel
  '#C9B8E8', // violeta pastel
  '#FFB3C6', // rosa pastel
  '#B5EAD7', // verde pastel
  '#AEC6CF', // gris azulado pastel
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