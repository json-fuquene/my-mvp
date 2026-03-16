'use client'

import { exportarCSV } from '@/lib/actions'

export default function BotonExportar() {
  async function handleExportar() {
    const csv = await exportarCSV()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `operaciones_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExportar}
      className="border border-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-50 text-sm"
    >
      ↓ Exportar CSV
    </button>
  )
}