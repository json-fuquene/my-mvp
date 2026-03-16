import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import * as dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL })
const prisma  = new PrismaClient({ adapter })

async function main() {
  const result = await prisma.asset.create({
    data: {
      symbol: 'LINK',
      name:   'Chainlink',
      type:   'crypto',
      isBVC:  false
    }
  })
  console.log('Creado:', result)
}

main()
  .catch(e => console.error('Error detallado:', e))
  .finally(() => prisma.$disconnect())