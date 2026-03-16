// Mapa de símbolos a IDs de CoinGecko
const COINGECKO_IDS = {
  BTC:   'bitcoin',
  ETH:   'ethereum',
  BNB:   'binancecoin',
  SOL:   'solana',
  XRP:   'ripple',
  ADA:   'cardano',
  AVAX:  'avalanche-2',
  DOT:   'polkadot',
  MATIC: 'matic-network',
  LINK:  'chainlink',
  UNI:   'uniswap',
  ATOM:  'cosmos',
  LTC:   'litecoin',
  DOGE:  'dogecoin',
  SHIB:  'shiba-inu',
}

// Función principal — obtiene precios para una lista de símbolos
export async function obtenerPrecios(symbols, activosConPrecioManual = {}) {
  if (!symbols || symbols.length === 0) return {}

  const cripto    = symbols.filter(s => COINGECKO_IDS[s])
  const acciones  = symbols.filter(s => !COINGECKO_IDS[s] && !activosConPrecioManual[s])
  const manuales  = symbols.filter(s => activosConPrecioManual[s])

  const [preciosCripto, preciosAcciones] = await Promise.allSettled([
    cripto.length   > 0 ? fetchCoinGecko(cripto)      : Promise.resolve({}),
    acciones.length > 0 ? fetchYahooFinance(acciones)  : Promise.resolve({})
  ])

  // Precios manuales en COP — los convertimos a USD usando TRM
  const preciosManuales = {}
  for (const symbol of manuales) {
    const precioCOP = activosConPrecioManual[symbol]
    if (precioCOP) {
      preciosManuales[symbol] = { precio: precioCOP, manual: true }
    }
  }

  return {
    ...(preciosCripto.status   === 'fulfilled' ? preciosCripto.value   : {}),
    ...(preciosAcciones.status === 'fulfilled' ? preciosAcciones.value : {}),
    ...preciosManuales
  }
}

// ── CoinGecko ─────────────────────────────────────────────────────────

async function fetchCoinGecko(symbols) {
  const ids = symbols.map(s => COINGECKO_IDS[s]).join(',')
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`

  const res = await fetch(url, {
    next: { revalidate: 900 } // cache de 15 minutos en Next.js
  })

  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)

  const data = await res.json()

  // Convertir de { bitcoin: { usd: 65000 } } a { BTC: 65000 }
  const precios = {}
  for (const symbol of symbols) {
    const id = COINGECKO_IDS[symbol]
    if (data[id]?.usd) {
      precios[symbol] = data[id].usd
    }
  }

  return precios
}

// ── Yahoo Finance ─────────────────────────────────────────────────────

async function fetchYahooFinance(symbols) {
  const precios = {}

  // Yahoo Finance no tiene una API oficial — usamos el endpoint público
  // Consultamos cada símbolo individualmente para mayor confiabilidad
  await Promise.all(symbols.map(async (symbol) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`

      const res = await fetch(url, {
        next: { revalidate: 900 }, // cache de 15 minutos en Next.js
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      })

      if (!res.ok) return

      const data = await res.json()
      const precio = data?.chart?.result?.[0]?.meta?.regularMarketPrice

      if (precio) {
        precios[symbol] = precio
      }
    } catch {
      console.warn(`No se pudo obtener precio para ${symbol}`)
    }
  }))

  return precios
}
// ── TRM (Banco de la República) ───────────────────────────────────────

export async function obtenerTRMActual() {
  try {
    // API oficial del Banco de la República
    const hoy = new Date()
    const fecha = hoy.toISOString().split('T')[0] // formato YYYY-MM-DD

    const url = `https://www.banrep.gov.co/es/estadisticas/trm?field_consulta_date_value=${fecha}`

    // Usamos una API alternativa más confiable para JSON
    const urlAPI = `https://api.exchangerate-api.com/v4/latest/USD`

    const res = await fetch(urlAPI, {
      next: { revalidate: 3600 } // cache de 1 hora
    })

    if (!res.ok) throw new Error(`Error TRM: ${res.status}`)

    const data = await res.json()
    const trm = data?.rates?.COP

    if (!trm) throw new Error('TRM no disponible')

    return trm
  } catch (error) {
    console.warn('No se pudo obtener TRM:', error.message)
    return null
  }
}