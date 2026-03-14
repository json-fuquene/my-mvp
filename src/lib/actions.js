'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { calcularPortafolio } from '@/lib/portafolio'

// ── Activos ──────────────────────────────────────────

export async function getActivos() {
  return await prisma.asset.findMany({
    orderBy: { symbol: 'asc' }
  })
}

// ── Operaciones ──────────────────────────────────────

export async function getOperaciones() {
  return await prisma.operation.findMany({
    include: { asset: true },
    orderBy: { date: 'desc' }
  })
}

export async function crearOperacion(formData) {
  const data = {
    assetSymbol: formData.get('assetSymbol').toUpperCase(),
    type:        formData.get('type'),
    quantity:    parseFloat(formData.get('quantity')),
    price:       parseFloat(formData.get('price')),
    currency:    formData.get('currency'),
    trm:         parseFloat(formData.get('trm')),
    commission:  parseFloat(formData.get('commission') || '0'),
    date:        new Date(formData.get('date'))
  }

  // Validación básica
  if (!data.assetSymbol || !data.type || isNaN(data.quantity) ||
      isNaN(data.price) || !data.currency || isNaN(data.trm) || !data.date) {
    throw new Error('Todos los campos obligatorios deben estar completos')
  }

  await prisma.operation.create({ data })

  revalidatePath('/operaciones')
  revalidatePath('/portafolio')
  redirect('/operaciones')
}

export async function crearActivo(formData) {
  const data = {
    symbol: formData.get('symbol').toUpperCase(),
    name:   formData.get('name'),
    type:   formData.get('type')
  }

  await prisma.asset.create({ data })

  revalidatePath('/operaciones/nueva')
}

// ── Portafolio ────────────────────────────────────────

export async function getPortafolio() {
  const operaciones = await prisma.operation.findMany({
    include: { asset: true },
    orderBy: { date: 'asc' }
  })

  // Obtener símbolos únicos
  const symbols = [...new Set(operaciones.map(op => op.assetSymbol))]

  // Obtener precios y TRM en paralelo
  let precios = {}
  let trmActual = null

  try {
    const { obtenerPrecios, obtenerTRMActual } = await import('@/lib/precios')
    ;[precios, trmActual] = await Promise.all([
      obtenerPrecios(symbols),
      obtenerTRMActual()
    ])
  } catch (error) {
    console.warn('Error obteniendo datos externos:', error.message)
  }

  const portafolio = calcularPortafolio(operaciones, precios)

  // Agregar conversión COP al resumen y posiciones
  return enriquecerConCOP(portafolio, trmActual)
}

function enriquecerConCOP(portafolio, trmActual) {
  const { positions, summary } = portafolio

  // Enriquecer cada posición
  const positionsEnriquecidas = positions.map(pos => ({
    ...pos,
    currentValueCOP: pos.currentValueUSD !== null && trmActual
      ? Math.round(pos.currentValueUSD * trmActual)
      : null,
    profitLossCOP: pos.profitLossUSD !== null && trmActual
      ? Math.round(pos.profitLossUSD * trmActual)
      : null,
    trmActual
  }))

  // Enriquecer resumen
  const summaryEnriquecido = {
    ...summary,
    trmActual,
    totalCurrentValueCOP: summary.totalCurrentValueUSD !== null && trmActual
      ? Math.round(summary.totalCurrentValueUSD * trmActual)
      : null,
    totalProfitLossCOP: summary.totalProfitLossUSD !== null && trmActual
      ? Math.round(summary.totalProfitLossUSD * trmActual)
      : null
  }

  return {
    positions: positionsEnriquecidas,
    summary: summaryEnriquecido
  }
}

export async function getOperacionesPorActivo(symbol) {
  return await prisma.operation.findMany({
    where: { assetSymbol: symbol.toUpperCase() },
    include: { asset: true },
    orderBy: { date: 'desc' }
  })
}

export async function getActivo(symbol) {
  return await prisma.asset.findUnique({
    where: { symbol: symbol.toUpperCase() }
  })
}

export async function exportarCSV() {
  const operaciones = await prisma.operation.findMany({
    include: { asset: true },
    orderBy: { date: 'desc' }
  })

  const filas = [
    // Encabezado
    ['Fecha', 'Activo', 'Nombre', 'Tipo', 'Cantidad', 'Precio', 'Moneda', 'TRM', 'Comision', 'Total USD', 'Total COP'].join(','),
    // Datos
    ...operaciones.map(op => {
      const totalUSD = op.quantity * op.price + op.commission
      const totalCOP = totalUSD * op.trm
      return [
        new Date(op.date).toLocaleDateString('es-CO'),
        op.assetSymbol,
        op.asset.name,
        op.type === 'buy' ? 'Compra' : 'Venta',
        op.quantity,
        op.price,
        op.currency,
        op.trm,
        op.commission,
        totalUSD.toFixed(2),
        Math.round(totalCOP)
      ].join(',')
    })
  ]

  return filas.join('\n')
}

// Eliminar operacion
export async function eliminarOperacion(id) {
  await prisma.operation.delete({
    where: { id: parseInt(id) }
  })
  revalidatePath('/operaciones')
  revalidatePath('/portafolio')
}