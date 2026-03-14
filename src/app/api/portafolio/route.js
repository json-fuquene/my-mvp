import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { calculatePortfolio } from '@/lib/portafolio'

// GET /api/portfolio — Calcula y devuelve el portafolio actual
export async function GET() {
  try {
    const operations = await prisma.operation.findMany({
      include: { asset: true },
      orderBy: { date: 'asc' }  // importante: orden cronológico para el cálculo
    })

    // Por ahora sin precios actuales (se agregan en el Ítem 8)
    const portafolio = calculatePortfolio(operations, {})

    return NextResponse.json(portafolio)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error al calcular el portafolio' },
      { status: 500 }
    )
  }
}