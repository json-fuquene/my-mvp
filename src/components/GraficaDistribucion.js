'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORES = [
  '#6EEDB2', // menta marca
  '#A8D8EA', // azul cielo suave
  '#B5C8F0', // azul lavanda
  '#C3B8E8', // violeta suave
  '#F0C4D4', // rosa pálido
  '#F7D9A8', // durazno suave
  '#FAE8A0', // amarillo crema
  '#B8E6C1', // verde menta claro
  '#A8DDD4', // turquesa suave
  '#D4C5B0', // beige cálido
  '#C8DEB8', // verde sage
  '#B8C8D8', // gris azulado
  '#E8C4B8', // salmón suave
  '#C4D8B8', // verde oliva claro
  '#D8B8D4', // malva suave
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
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={datos}
          cx="40%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={3}
          dataKey="value"
        >
          {datos.map((entry, index) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={formatearTooltip} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          formatter={(value) => (
            <span style={{ color: '#374151', fontSize: '11px' }}>{value}</span>
          )}
          wrapperStyle={{ paddingTop: '8px', lineHeight: '20px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}