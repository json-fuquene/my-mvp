import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/assets — Lista todos los activos
export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: { symbol: 'asc' }
    })
    return NextResponse.json(assets)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener activos' },
      { status: 500 }
    )
  }
}

// POST /api/assets — Crea un nuevo activo
export async function POST(request) {
  try {
    const body = await request.json()
    const { symbol, name, type } = body

    // Validación básica
    if (!symbol || !name || !type) {
      return NextResponse.json(
        { error: 'symbol, name y type son requeridos' },
        { status: 400 }
      )
    }

    const asset = await prisma.asset.create({
      data: {
        symbol: symbol.toUpperCase(),
        name,
        type
      }
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    // Error de duplicado (símbolo ya existe)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El activo ya existe' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Error al crear activo' },
      { status: 500 }
    )
  }
}

// PATCH /api/assets — Actualiza el precio manual de un activo
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { symbol, manualPrice } = body

    if (!symbol || manualPrice === undefined) {
      return NextResponse.json(
        { error: 'symbol y manualPrice son requeridos' },
        { status: 400 }
      )
    }

    const asset = await prisma.asset.update({
      where: { symbol: symbol.toUpperCase() },
      data:  { manualPrice: parseFloat(manualPrice) }
    })

    return NextResponse.json(asset)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar precio' },
      { status: 500 }
    )
  }
}