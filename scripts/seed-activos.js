import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import * as dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL })
const prisma  = new PrismaClient({ adapter })

const activos = [
  // ── NASDAQ — Top 50 ────────────────────────────────────────────────
  { symbol: 'AAPL',  name: 'Apple Inc.',                    type: 'stock' },
  { symbol: 'MSFT',  name: 'Microsoft Corporation',         type: 'stock' },
  { symbol: 'NVDA',  name: 'NVIDIA Corporation',            type: 'stock' },
  { symbol: 'AMZN',  name: 'Amazon.com Inc.',               type: 'stock' },
  { symbol: 'META',  name: 'Meta Platforms Inc.',           type: 'stock' },
  { symbol: 'GOOGL', name: 'Alphabet Inc. Class A',         type: 'stock' },
  { symbol: 'GOOG',  name: 'Alphabet Inc. Class C',         type: 'stock' },
  { symbol: 'TSLA',  name: 'Tesla Inc.',                    type: 'stock' },
  { symbol: 'AVGO',  name: 'Broadcom Inc.',                 type: 'stock' },
  { symbol: 'COST',  name: 'Costco Wholesale Corporation',  type: 'stock' },
  { symbol: 'ASML',  name: 'ASML Holding N.V.',             type: 'stock' },
  { symbol: 'NFLX',  name: 'Netflix Inc.',                  type: 'stock' },
  { symbol: 'AMD',   name: 'Advanced Micro Devices Inc.',   type: 'stock' },
  { symbol: 'ADBE',  name: 'Adobe Inc.',                    type: 'stock' },
  { symbol: 'QCOM',  name: 'Qualcomm Inc.',                 type: 'stock' },
  { symbol: 'INTC',  name: 'Intel Corporation',             type: 'stock' },
  { symbol: 'INTU',  name: 'Intuit Inc.',                   type: 'stock' },
  { symbol: 'AMGN',  name: 'Amgen Inc.',                    type: 'stock' },
  { symbol: 'AMAT',  name: 'Applied Materials Inc.',        type: 'stock' },
  { symbol: 'MU',    name: 'Micron Technology Inc.',        type: 'stock' },
  { symbol: 'LRCX',  name: 'Lam Research Corporation',     type: 'stock' },
  { symbol: 'KLAC',  name: 'KLA Corporation',               type: 'stock' },
  { symbol: 'MRVL',  name: 'Marvell Technology Inc.',       type: 'stock' },
  { symbol: 'PANW',  name: 'Palo Alto Networks Inc.',       type: 'stock' },
  { symbol: 'SNPS',  name: 'Synopsys Inc.',                 type: 'stock' },
  { symbol: 'CDNS',  name: 'Cadence Design Systems Inc.',   type: 'stock' },
  { symbol: 'CRWD',  name: 'CrowdStrike Holdings Inc.',     type: 'stock' },
  { symbol: 'ORLY',  name: "O'Reilly Automotive Inc.",      type: 'stock' },
  { symbol: 'MELI',  name: 'MercadoLibre Inc.',             type: 'stock' },
  { symbol: 'FTNT',  name: 'Fortinet Inc.',                 type: 'stock' },
  { symbol: 'WDAY',  name: 'Workday Inc.',                  type: 'stock' },
  { symbol: 'DXCM',  name: 'DexCom Inc.',                   type: 'stock' },
  { symbol: 'ADP',   name: 'Automatic Data Processing',     type: 'stock' },
  { symbol: 'PYPL',  name: 'PayPal Holdings Inc.',          type: 'stock' },
  { symbol: 'ABNB',  name: 'Airbnb Inc.',                   type: 'stock' },
  { symbol: 'DASH',  name: 'DoorDash Inc.',                 type: 'stock' },
  { symbol: 'UBER',  name: 'Uber Technologies Inc.',        type: 'stock' },
  { symbol: 'ZM',    name: 'Zoom Video Communications',     type: 'stock' },
  { symbol: 'SHOP',  name: 'Shopify Inc.',                  type: 'stock' },
  { symbol: 'SNOW',  name: 'Snowflake Inc.',                type: 'stock' },
  { symbol: 'COIN',  name: 'Coinbase Global Inc.',          type: 'stock' },
  { symbol: 'RBLX',  name: 'Roblox Corporation',            type: 'stock' },
  { symbol: 'SPOT',  name: 'Spotify Technology S.A.',       type: 'stock' },
  { symbol: 'HOOD',  name: 'Robinhood Markets Inc.',        type: 'stock' },
  { symbol: 'PLTR',  name: 'Palantir Technologies Inc.',    type: 'stock' },

  // ── ETFs populares ─────────────────────────────────────────────────
  { symbol: 'SPY',   name: 'SPDR S&P 500 ETF Trust',       type: 'etf' },
  { symbol: 'QQQ',   name: 'Invesco QQQ Trust',             type: 'etf' },
  { symbol: 'VTI',   name: 'Vanguard Total Stock Market',   type: 'etf' },
  { symbol: 'VOO',   name: 'Vanguard S&P 500 ETF',          type: 'etf' },
  { symbol: 'IWM',   name: 'iShares Russell 2000 ETF',      type: 'etf' },

  // ── BVC Colombia ───────────────────────────────────────────────────
  { symbol: 'ECOPETROL.CL', name: 'Ecopetrol S.A.',                    type: 'stock' },
  { symbol: 'PFBCOLOM.CL',  name: 'Bancolombia S.A. Pref.',            type: 'stock' },
  { symbol: 'ISA.CL',       name: 'Interconexión Eléctrica S.A.',      type: 'stock' },
  { symbol: 'NUTRESA.CL',   name: 'Grupo Nutresa S.A.',                type: 'stock' },
  { symbol: 'GRUPOSURA.CL', name: 'Grupo de Inversiones Suramericana', type: 'stock' },
  { symbol: 'CEMARGOS.CL',  name: 'Cementos Argos S.A.',               type: 'stock' },
  { symbol: 'BOGOTA.CL',    name: 'Banco de Bogotá S.A.',              type: 'stock' },
  { symbol: 'CORFICOLCF.CL',name: 'Corficolombiana S.A.',              type: 'stock' },
  { symbol: 'CELSIA.CL',    name: 'Celsia S.A. E.S.P.',                type: 'stock' },
  { symbol: 'CONCONCRET.CL',name: 'Constructora Conconcreto S.A.',     type: 'stock' },

  // ── Criptomonedas ──────────────────────────────────────────────────
  { symbol: 'BTC',   name: 'Bitcoin',          type: 'crypto' },
  { symbol: 'ETH',   name: 'Ethereum',         type: 'crypto' },
  { symbol: 'BNB',   name: 'BNB',              type: 'crypto' },
  { symbol: 'SOL',   name: 'Solana',           type: 'crypto' },
  { symbol: 'XRP',   name: 'XRP',              type: 'crypto' },
  { symbol: 'ADA',   name: 'Cardano',          type: 'crypto' },
  { symbol: 'AVAX',  name: 'Avalanche',        type: 'crypto' },
  { symbol: 'DOT',   name: 'Polkadot',         type: 'crypto' },
  { symbol: 'MATIC', name: 'Polygon',          type: 'crypto' },
  { symbol: 'LINK',  name: 'Chainlink',        type: 'crypto' },
  { symbol: 'UNI',   name: 'Uniswap',          type: 'crypto' },
  { symbol: 'ATOM',  name: 'Cosmos',           type: 'crypto' },
  { symbol: 'LTC',   name: 'Litecoin',         type: 'crypto' },
  { symbol: 'DOGE',  name: 'Dogecoin',         type: 'crypto' },
  { symbol: 'SHIB',  name: 'Shiba Inu',        type: 'crypto' },
]

async function main() {
  console.log('Cargando activos...')

  let creados   = 0
  let omitidos  = 0

  for (const activo of activos) {
    try {
      await prisma.asset.upsert({
        where:  { symbol: activo.symbol },
        update: { name: activo.name, type: activo.type },
        create: activo
      })
      creados++
      console.log(`✓ ${activo.symbol}`)
    } catch (error) {
      omitidos++
      console.warn(`✗ ${activo.symbol}: ${error.message}`)
    }
  }

  console.log(`\nListo: ${creados} activos cargados, ${omitidos} omitidos.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())