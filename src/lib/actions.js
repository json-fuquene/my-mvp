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
  return calcularPortafolio(operaciones, {})
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