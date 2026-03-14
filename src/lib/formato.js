// Formatea un número como moneda
export function formatearUSD(valor) {
  if (valor === null || valor === undefined) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(valor)
}

export function formatearCOP(valor) {
  if (valor === null || valor === undefined) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor)
}

export function formatearPorcentaje(valor) {
  if (valor === null || valor === undefined) return '—'
  const signo = valor > 0 ? '+' : ''
  return `${signo}${valor.toFixed(2)}%`
}

export function formatearCantidad(valor, decimales = 8) {
  if (valor === null || valor === undefined) return '—'
  return parseFloat(valor.toFixed(decimales)).toString()
}

export function colorRentabilidad(valor) {
  if (valor === null || valor === undefined) return 'text-[#314158]'
  if (valor > 0) return 'text-[#31D492]'
  if (valor < 0) return 'text-[#C11007]'
  return 'text-gray-600'
}

export function formatearTRM(valor) {
  if (!valor) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2
  }).format(valor)
}