/**
 * Calcula el portafolio completo a partir de un array de operaciones.
 * @param {Array} operations - Lista de operaciones desde la BD (incluye asset)
 * @param {Object} currentPrices - Mapa de precios actuales { "BTC": 60000, ... }
 * @returns {Object} - Posiciones calculadas y resumen del portafolio
 */
export function calcularPortafolio(operations, currentPrices = {}) {
  // Paso 1: Agrupar operaciones por activo
  const grouped = groupByAsset(operations)

  // Paso 2: Calcular métricas por activo
  const positions = Object.values(grouped).map(({ asset, ops }) =>
    calculatePosition(asset, ops, currentPrices[asset.symbol] ?? null)
  )

  // Paso 3: Filtrar activos con cantidad > 0 (posiciones activas)
  const activePositions = positions.filter(p => p.quantity > 0.000001)

  // Paso 4: Calcular resumen general
  const summary = calculateSummary(activePositions)

  return { positions: activePositions, summary }
}

/**
 * Agrupa las operaciones por símbolo de activo.
 */
function groupByAsset(operations) {
  return operations.reduce((acc, op) => {
    const symbol = op.assetSymbol
    if (!acc[symbol]) {
      acc[symbol] = { asset: op.asset, ops: [] }
    }
    acc[symbol].ops.push(op)
    return acc
  }, {})
}

/**
 * Calcula las métricas de una posición individual.
 */
function calculatePosition(asset, operations, currentPrice) {
  let quantity = 0
  let totalCostUSD = 0
  let totalCostCOP = 0

  for (const op of operations) {
    const costUSD = op.quantity * op.price + (op.commission ?? 0)
    const costCOP = costUSD * op.trm

    if (op.type === 'buy') {
      quantity += op.quantity
      totalCostUSD += costUSD
      totalCostCOP += costCOP
    } else if (op.type === 'sell') {
      // Al vender, reducimos proporcionalmente el costo
      const proportion = op.quantity / quantity
      quantity -= op.quantity
      totalCostUSD -= totalCostUSD * proportion
      totalCostCOP -= totalCostCOP * proportion
    }
  }

  // Precio promedio ponderado
  const avgPrice = quantity > 0 ? totalCostUSD / quantity : 0

  // Métricas con precio actual (pueden ser null si no hay precio)
  const currentValueUSD = currentPrice !== null ? quantity * currentPrice : null
  const profitLossUSD = currentValueUSD !== null ? currentValueUSD - totalCostUSD : null
  const profitLossPct = profitLossUSD !== null && totalCostUSD > 0
    ? (profitLossUSD / totalCostUSD) * 100
    : null

  return {
    symbol: asset.symbol,
    name: asset.name,
    type: asset.type,
    quantity: roundTo(quantity, 8),
    avgPrice: roundTo(avgPrice, 2),
    totalCostUSD: roundTo(totalCostUSD, 2),
    totalCostCOP: roundTo(totalCostCOP, 0),
    currentPrice,
    currentValueUSD: currentValueUSD !== null ? roundTo(currentValueUSD, 2) : null,
    profitLossUSD: profitLossUSD !== null ? roundTo(profitLossUSD, 2) : null,
    profitLossPct: profitLossPct !== null ? roundTo(profitLossPct, 2) : null,
    exposurePct: null  // se calcula en el resumen
  }
}

/**
 * Calcula el resumen total del portafolio y la exposición por activo.
 */
function calculateSummary(positions) {
  const totalCostUSD = positions.reduce((sum, p) => sum + p.totalCostUSD, 0)
  const totalCostCOP = positions.reduce((sum, p) => sum + p.totalCostCOP, 0)

  const hasCurrentValues = positions.every(p => p.currentValueUSD !== null)
  const totalCurrentValueUSD = hasCurrentValues
    ? positions.reduce((sum, p) => sum + p.currentValueUSD, 0)
    : null

  const totalProfitLossUSD = totalCurrentValueUSD !== null
    ? totalCurrentValueUSD - totalCostUSD
    : null

  const totalProfitLossPct = totalProfitLossUSD !== null && totalCostUSD > 0
    ? (totalProfitLossUSD / totalCostUSD) * 100
    : null

  // Calcular exposición de cada posición respecto al costo total
  positions.forEach(p => {
    p.exposurePct = totalCostUSD > 0
      ? roundTo((p.totalCostUSD / totalCostUSD) * 100, 2)
      : null
  })

  return {
    totalCostUSD: roundTo(totalCostUSD, 2),
    totalCostCOP: roundTo(totalCostCOP, 0),
    totalCurrentValueUSD: totalCurrentValueUSD !== null ? roundTo(totalCurrentValueUSD, 2) : null,
    totalProfitLossUSD: totalProfitLossUSD !== null ? roundTo(totalProfitLossUSD, 2) : null,
    totalProfitLossPct: totalProfitLossPct !== null ? roundTo(totalProfitLossPct, 2) : null
  }
}

/**
 * Redondea un número a N decimales.
 */
function roundTo(value, decimals) {
  return Math.round(value * 10 ** decimals) / 10 ** decimals
}