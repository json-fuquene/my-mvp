'use client'

import { useState } from 'react'

export default function FormPrecioManual({ symbol, precioActual, actualizarPrecioManual }) {
  const [editando, setEditando]   = useState(false)
  const [precio, setPrecio]       = useState(precioActual?.toString() ?? '')
  const [guardando, setGuardando] = useState(false)

  async function handleGuardar() {
    if (!precio) return
    setGuardando(true)
    await actualizarPrecioManual(symbol, precio)
    setGuardando(false)
    setEditando(false)
  }

  if (!editando) {
    return (
      <button
        onClick={() => setEditando(true)}
        className="text-xs text-gray-400 hover:text-[#1a9e6e] transition-colors border border-gray-200 hover:border-[#6EEDB2] px-2 py-1 rounded-lg"
      >
        {precioActual ? 'Editar' : '+ Precio'}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <input
        type="number"
        step="any"
        value={precio}
        onChange={e => setPrecio(e.target.value)}
        placeholder="Precio en COP"
        className="border rounded-lg px-2 py-1 text-xs w-32 text-right"
        autoFocus
      />
      <button
        onClick={handleGuardar}
        disabled={guardando}
        className="text-xs bg-[#6EEDB2] text-[#374151] px-2 py-1 rounded-lg hover:bg-[#4dd99a] transition-colors disabled:opacity-50"
      >
        {guardando ? '...' : 'OK'}
      </button>
      <button
        onClick={() => setEditando(false)}
        className="text-xs text-gray-400 hover:text-gray-600 px-1"
      >
        ✕
      </button>
    </div>
  )
}