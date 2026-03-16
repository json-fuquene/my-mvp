import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/operations — Lista todas las operaciones
export async function GET() {
  try {
    const operations = await prisma.operation.findMany({
      include: { asset: true },  // trae también los datos del activo
      orderBy: { date: 'desc' }
    })
    return NextResponse.json(operations)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener operaciones' },
      { status: 500 }
    )
  }
}

// POST /api/operations — Registra una nueva operación
export async function POST(request) {
  try {
    const body = await request.json()
    const { assetSymbol, type, quantity, price, currency, trm, commission, date } = body

    // Validación básica
    if (!assetSymbol || !type || !quantity || !price || !currency || !trm || !date) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben estar presentes' },
        { status: 400 }
      )
    }

    const operation = await prisma.operation.create({
      data: {
        assetSymbol: assetSymbol.toUpperCase(),
        type,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        currency,
        trm: parseFloat(trm),
        commission: parseFloat(commission ?? 0),
        date: new Date(date)
      },
      include: { asset: true }
    })

    return NextResponse.json(operation, { status: 201 })
  } catch (error) {
    // El activo no existe
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'El activo no existe. Créalo primero.' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al registrar operación' },
      { status: 500 }
    )
  }
}