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
    date:        new Date()
  }

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

  const symbols = [...new Set(operaciones.map(op => op.assetSymbol))]

  // 1. Obtiene TRM primero
  let trmActual = null
  try {
    const { obtenerTRMActual } = await import('@/lib/precios')
    trmActual = await obtenerTRMActual()
  } catch (error) {
    console.warn('Error obteniendo TRM:', error.message)
  }

  // 2. Obtiene activos BVC con precio manual y convierte COP → USD
  const activosDB = await prisma.asset.findMany({
    where:  { symbol: { in: symbols } },
    select: { symbol: true, manualPrice: true, isBVC: true }
  })

  const preciosManuales = Object.fromEntries(
    activosDB
      .filter(a => a.isBVC && a.manualPrice !== null)
      .map(a => [a.symbol, trmActual
        ? parseFloat((a.manualPrice / trmActual).toFixed(4))
        : null
      ])
  )

  // 3. Obtiene precios automáticos pasando los manuales
  let precios = {}
  try {
    const { obtenerPrecios } = await import('@/lib/precios')
    precios = await obtenerPrecios(symbols, preciosManuales)
  } catch (error) {
    console.warn('Error obteniendo precios:', error.message)
  }

  // 4. Normaliza formato
  precios = Object.fromEntries(
    Object.entries(precios).map(([k, v]) => [k, v?.precio ?? v])
  )

  // 5. Calcula portafolio
  const portafolio = calcularPortafolio(operaciones, precios)

  // 6. Enriquece con COP
  return enriquecerConCOP(portafolio, trmActual)
}

function enriquecerConCOP(portafolio, trmActual) {
  const { positions, summary } = portafolio

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
    summary:   summaryEnriquecido
  }
}

// ── Activo individual ─────────────────────────────────

export async function getOperacionesPorActivo(symbol) {
  return await prisma.operation.findMany({
    where:   { assetSymbol: symbol.toUpperCase() },
    include: { asset: true },
    orderBy: { date: 'desc' }
  })
}

export async function getActivo(symbol) {
  return await prisma.asset.findUnique({
    where: { symbol: symbol.toUpperCase() }
  })
}

// ── CSV ───────────────────────────────────────────────

export async function exportarCSV() {
  const operaciones = await prisma.operation.findMany({
    include: { asset: true },
    orderBy: { date: 'desc' }
  })

  const filas = [
    ['Fecha', 'Activo', 'Nombre', 'Tipo', 'Cantidad', 'Precio', 'Moneda', 'TRM', 'Comision', 'Total USD', 'Total COP'].join(','),
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

// ── Eliminar operación ────────────────────────────────

export async function eliminarOperacion(id) {
  await prisma.operation.delete({
    where: { id: parseInt(id) }
  })
  revalidatePath('/operaciones')
  revalidatePath('/portafolio')
}

// ── TRM ───────────────────────────────────────────────

export async function getTRMActual() {
  const { obtenerTRMActual } = await import('@/lib/precios')
  const trm = await obtenerTRMActual()
  return trm
}

// ── Activos por tipo ──────────────────────────────────

export async function getActivosPorTipo(tipo) {
  const activos = await prisma.asset.findMany({
    where:   { type: tipo },
    orderBy: { symbol: 'asc' },
    select: {
      id:          true,
      symbol:      true,
      name:        true,
      type:        true,
      manualPrice: true,
      isBVC:       true,
    }
  })

  const symbols = activos.map(a => a.symbol)
  let precios   = {}

  try {
    const { obtenerPrecios } = await import('@/lib/precios')
    precios = await obtenerPrecios(symbols)
  } catch (error) {
    console.warn('Error obteniendo precios:', error.message)
  }

  return activos.map(a => ({
  ...a,
  precioActual: a.isBVC
    ? null
    : precios[a.symbol]?.precio ?? precios[a.symbol] ?? null,
  }))
}

// ── Precio manual ─────────────────────────────────────

export async function actualizarPrecioManual(symbol, precioManual) {
  await prisma.asset.update({
    where: { symbol: symbol.toUpperCase() },
    data:  { manualPrice: parseFloat(precioManual) }
  })
  revalidatePath('/activos/stock')
  revalidatePath('/portafolio')
}