'use client'

import { useState } from 'react'

export default function FormularioOperacion({ activos, crearOperacion, crearActivo }) {
  const [mostrarNuevoActivo, setMostrarNuevoActivo] = useState(false)
  const [listaActivos, setListaActivos] = useState(activos)

  async function handleNuevoActivo(formData) {
    await crearActivo(formData)
    setMostrarNuevoActivo(false)
    // Recarga la lista de activos
    const res = await fetch('/api/assets')
    const data = await res.json()
    setListaActivos(data)
  }

  return (
    <div className="space-y-6">

      {/* Formulario principal de operación */}
      <form action={crearOperacion} className="space-y-4">

        {/* Activo */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Activo</label>
            <select
              name="assetSymbol"
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecciona un activo</option>
              {listaActivos.map(a => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol} — {a.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setMostrarNuevoActivo(!mostrarNuevoActivo)}
            className="border px-3 py-2 rounded text-sm hover:bg-gray-100"
          >
            + Activo
          </button>
        </div>

        {/* Formulario inline para nuevo activo */}
        {mostrarNuevoActivo && (
          <form action={handleNuevoActivo} className="bg-gray-50 p-4 rounded space-y-3">
            <p className="text-sm font-medium">Registrar nuevo activo</p>
            <input
              name="symbol"
              placeholder="Símbolo (ej. AAPL)"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <input
              name="name"
              placeholder="Nombre (ej. Apple Inc.)"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <select name="type" required className="w-full border rounded px-3 py-2 text-sm">
              <option value="">Tipo de activo</option>
              <option value="stock">Acción</option>
              <option value="etf">ETF</option>
              <option value="crypto">Criptomoneda</option>
            </select>
            <button
              type="submit"
              className="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
            >
              Guardar activo
            </button>
          </form>
        )}

        {/* Tipo de operación */}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select name="type" required className="w-full border rounded px-3 py-2">
            <option value="buy">Compra</option>
            <option value="sell">Venta</option>
          </select>
        </div>

        {/* Cantidad y Precio */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cantidad</label>
            <input
              name="quantity"
              type="number"
              step="any"
              required
              placeholder="0.5"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio por unidad</label>
            <input
              name="price"
              type="number"
              step="any"
              required
              placeholder="45000"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Moneda y TRM */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Moneda</label>
            <select name="currency" required className="w-full border rounded px-3 py-2">
              <option value="USD">USD</option>
              <option value="COP">COP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">TRM (COP por USD)</label>
            <input
              name="trm"
              type="number"
              step="any"
              required
              placeholder="4200"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Comisión y Fecha */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Comisión <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              name="commission"
              type="number"
              step="any"
              placeholder="0"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              name="date"
              type="date"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
        >
          Registrar operación
        </button>
      </form>
    </div>
  )
}