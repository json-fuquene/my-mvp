import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import * as dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL })
const prisma  = new PrismaClient({ adapter })

async function main() {
  console.log('Eliminando activos con sufijo .CL...')

  const eliminados = await prisma.asset.deleteMany({
    where: {
      symbol: { endsWith: '.CL' }
    }
  })

  console.log(`✓ ${eliminados.count} activos eliminados.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())