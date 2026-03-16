'use client'

import { useState } from 'react'

export default function FormularioOperacion({ activos, crearOperacion, crearActivo, trmInicial, fechaInicial }) {
  // const [mostrarNuevoActivo, setMostrarNuevoActivo] = useState(false)
  const [listaActivos, setListaActivos]             = useState(activos)
  const [activoSeleccionado, setActivoSeleccionado] = useState('')
  const [tipo, setTipo]                             = useState('')
  const [precioUSD, setPrecioUSD]                   = useState('')
  const [precioCOP, setPrecioCOP]                   = useState('')
  const [totalUSD, setTotalUSD]                     = useState('')
  const [totalCOP, setTotalCOP]                     = useState('')
  const [cantidad, setCantidad]                     = useState('')
  const [trm, setTrm]     = useState(trmInicial?.toString() ?? '')
  const fecha = fechaInicial ?? new Date().toISOString().split('T')[0]

  // ── Helpers ──────────────────────────────────────────────────────────

  function calcularCantidad(pUSD, vUSD) {
    const p = parseFloat(pUSD)
    const v = parseFloat(vUSD)
    if (!isNaN(p) && p > 0 && !isNaN(v) && v > 0) {
      setCantidad((v / p).toFixed(8))
    } else {
      setCantidad('')
    }
  }

  // ── Precio unitario ──────────────────────────────────────────────────

  function handlePrecioUSDChange(e) {
    const val = e.target.value
    setPrecioUSD(val)
    const p = parseFloat(val)
    const t = parseFloat(trm)

    if (!isNaN(p) && !isNaN(t)) setPrecioCOP(Math.round(p * t).toString())
    else setPrecioCOP('')

    calcularCantidad(val, totalUSD)
  }

  function handlePrecioCOPChange(e) {
    const val = e.target.value
    setPrecioCOP(val)
    const cop = parseFloat(val)
    const t   = parseFloat(trm)

    if (!isNaN(cop) && !isNaN(t) && t > 0) {
      const usd = (cop / t).toFixed(2)
      setPrecioUSD(usd)
      calcularCantidad(usd, totalUSD)
    } else {
      setPrecioUSD('')
    }
  }

  // ── Total a invertir ─────────────────────────────────────────────────

  function handleTotalUSDChange(e) {
    const val = e.target.value
    setTotalUSD(val)
    const usd = parseFloat(val)
    const t   = parseFloat(trm)

    if (!isNaN(usd) && !isNaN(t)) setTotalCOP(Math.round(usd * t).toString())
    else setTotalCOP('')

    calcularCantidad(precioUSD, val)
  }

  function handleTotalCOPChange(e) {
    const val = e.target.value
    setTotalCOP(val)
    const cop = parseFloat(val)
    const t   = parseFloat(trm)

    if (!isNaN(cop) && !isNaN(t) && t > 0) {
      const usd = (cop / t).toFixed(2)
      setTotalUSD(usd)
      calcularCantidad(precioUSD, usd)
    } else {
      setTotalUSD('')
    }
  }

  // ── Nuevo activo ─────────────────────────────────────────────────────

  async function handleNuevoActivo() {
  const symbol = document.getElementById('nuevo-symbol').value
  const name   = document.getElementById('nuevo-name').value
  const type   = document.getElementById('nuevo-type').value

  if (!symbol || !name || !type) return

  const formData = new FormData()
  formData.append('symbol', symbol)
  formData.append('name', name)
  formData.append('type', type)

  await crearActivo(formData)
  setMostrarNuevoActivo(false)

  const res  = await fetch('/api/assets')
  const data = await res.json()
  setListaActivos(data)
}

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <form action={crearOperacion} className="space-y-5">

        {/* 1. Activo */}
        <div>
          <label className="block text-sm font-medium mb-1">Activo</label>
          <div className="flex gap-2">
            <select
              name="assetSymbol"
              required
              value={activoSeleccionado}
              onChange={e => setActivoSeleccionado(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            >
              <option value="">Selecciona un activo</option>
              {listaActivos.map(a => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol} — {a.name}
                </option>
              ))}
            </select>
            {/* <button
              type="button"
              onClick={() => setMostrarNuevoActivo(!mostrarNuevoActivo)}
              className="border px-3 py-2 rounded text-sm hover:bg-gray-100 whitespace-nowrap"
            >
              + Nuevo
            </button> */}
          </div>

          {/* {mostrarNuevoActivo && (
            <div className="mt-3 bg-gray-50 border rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium">Registrar nuevo activo</p>
              <input
                id="nuevo-symbol"
                placeholder="Símbolo (ej. AAPL)"
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <input
                id="nuevo-name"
                placeholder="Nombre (ej. Apple Inc.)"
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <select id="nuevo-type" className="w-full border rounded px-3 py-2 text-sm">
                <option value="">Tipo de activo</option>
                <option value="stock">Acción</option>
                <option value="etf">ETF</option>
                <option value="crypto">Criptomoneda</option>
              </select>
              <button
                type="button"
                onClick={handleNuevoActivo}
                className="bg-[#6EEDB2] text-[#374151] px-4 py-2 rounded text-sm font-semibold hover:bg-[#4dd99a] transition-colors"
              >
                Guardar activo
              </button>
            </div>
          )} */}
        </div>

        {/* 2. Tipo */}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de operación</label>
          <div className="grid grid-cols-2 gap-3">
            {[['buy', 'Compra', 'text-green-600'], ['sell', 'Venta', 'text-red-600']].map(([val, label, color]) => (
              <label
                key={val}
                className="flex items-center gap-2 border rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="type"
                  value={val}
                  required
                  onChange={() => setTipo(val)}
                />
                <span className={`font-medium ${color}`}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 3. Moneda */}
        <div>
          <label className="block text-sm font-medium mb-1">Moneda de la operación</label>
          <div className="grid grid-cols-2 gap-3">
            {[['USD', 'Dólares (USD)'], ['COP', 'Pesos (COP)']].map(([val, label]) => (
              <label
                key={val}
                className="flex items-center gap-2 border rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50"
              >
                <input type="radio" name="currency" value={val} required />
                <span className="font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4 text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-3">
          <span>
            TRM:{" "}
            <span className="font-medium text-gray-600">
              {trm ? parseFloat(trm).toLocaleString('es-CO', { minimumFractionDigits: 2 }) : 'Cargando...'}
            </span>
          </span>
          <span>
            Fecha:{" "}
            <span className="font-medium text-gray-600">
              {new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </span>
        </div>

        {/* 5. Precio unitario */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">Valor actual del activo</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">USD</label>
              <input
                name="price"
                type="number"
                step="any"
                required
                value={precioUSD}
                onChange={handlePrecioUSDChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">COP</label>
              <input
                type="number"
                step="any"
                value={precioCOP}
                onChange={handlePrecioCOPChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 6. Total a invertir */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">
            {tipo === 'sell' ? 'Total venta' : 'Total compra'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">USD</label>
              <input
                type="number"
                step="any"
                value={totalUSD}
                onChange={handleTotalUSDChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">COP</label>
              <input
                type="number"
                step="any"
                value={totalCOP}
                onChange={handleTotalCOPChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Cantidad calculada */}
          {cantidad && (
            <div className="pt-2 border-t border-blue-200">
              <p className="text-xs text-gray-500 mb-1">Cantidad calculada</p>
              <p className="text-xl font-bold text-blue-700">
                {parseFloat(cantidad).toLocaleString('es-CO', { maximumFractionDigits: 8 })}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {activoSeleccionado || 'unidades'}
                </span>
              </p>
            </div>
          )}

          <input type="hidden" name="quantity" value={cantidad} />
        </div>

        <input type="hidden" name="trm" value={trm} />
        <input type="hidden" name="date" value={fecha} />

        {/* 8. Registrar */}
        <button
          type="submit"
          disabled={tipo === 'buy' && !cantidad}
          className="w-full bg-[#6EEDB2] text-[#374151] py-3 rounded-lg hover:bg-[#4dd99a] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Registrar operación
        </button>

      </form>
    </div>
  )
}