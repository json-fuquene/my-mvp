'use client'

import { eliminarOperacion } from '@/lib/actions'

export default function BotonEliminar({ id }) {
  async function handleEliminar() {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar esta operación?')
    if (!confirmar) return
    await eliminarOperacion(id)
  }

  return (
    <button
      onClick={handleEliminar}
      className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50"
    >
      Eliminar
    </button>
  )
}