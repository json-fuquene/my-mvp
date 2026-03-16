import { getActivosPorTipo } from '@/lib/actions'
import { actualizarPrecioManual } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { formatearUSD, formatearCOP } from '@/lib/formato'
import FormPrecioManual from './FormPrecioManual'

const CONFIG = {
  crypto: { titulo: 'Criptomonedas',  emoji: '🪙' },
  stock:  { titulo: 'Acciones',       emoji: '📊' },
  etf:    { titulo: 'ETFs',           emoji: '📦' },
}

export default async function ActivosTipoPage({ params }) {
  const { tipo } = await params

  if (!CONFIG[tipo]) notFound()
    let trmActual = 4200
    try {
    const { obtenerTRMActual } = await import('@/lib/precios')
    trmActual = await obtenerTRMActual() ?? 4200
    } catch {}

  const activos = await getActivosPorTipo(tipo)
  const { titulo, emoji } = CONFIG[tipo]

  const conPrecio    = activos.filter(a => a.precioActual !== null)
  const sinPrecio    = activos.filter(a => a.precioActual === null)

  return (
    <div className="max-w-3xl sm:max-w-4xl xl:max-w-6xl 2xl:max-w-screen-2xl mx-auto px-6 py-8 space-y-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {emoji} {titulo}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {activos.length} activos · precios actualizados cada 15 min
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="bg-[#6EEDB2]/20">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide w-40">
                  Símbolo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide w-48">
                  Nombre
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Precio actual (USD)
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Precio actual (COP)
                </th>
                <th className="px-4 py-3 text-right w-40"></th>
              </tr>
            </thead>
            
            <tbody>
              {activos.map((activo, i) => (
                <tr
                  key={activo.symbol}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {activo.symbol}
                      </span>
                      {activo.isBVC && (
                        <span className="text-xs bg-[#6EEDB2]/30 text-[#1a9e6e] px-2 py-0.5 rounded-full font-medium">
                          BVC
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 w-48 max-w-48 truncate">
                    {activo.name}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-gray-800">
                    {activo.precioActual ? (
                      formatearUSD(activo.precioActual)
                    ) : activo.manualPrice ? (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[#1a9e6e]">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(activo.manualPrice)}
                        </span>
                        <span className="text-xs text-gray-400">manual</span>
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500">
                    {activo.precioActual
                      ? formatearCOP(activo.precioActual * trmActual)
                      : <span className="text-gray-300 text-xs">—</span>
                    }
                  </td>
                  <td className="px-4 py-4 w-40 text-center">
                    {activo.isBVC && (
                      <FormPrecioManual
                        symbol={activo.symbol}
                        precioActual={activo.manualPrice}
                        actualizarPrecioManual={actualizarPrecioManual}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nota si hay activos sin precio */}
      {sinPrecio.length > 0 && (
        <p className="text-xs text-gray-400">
          {sinPrecio.length} activos sin precio disponible actualmente.
        </p>
      )}

    </div>
  )
}