import { getOperacionesPorActivo, getActivo, getPortafolio } from '@/lib/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import TarjetaMetrica from '@/components/TarjetaMetrica'
import BotonEliminar from '@/app/operaciones/BotonEliminar'
import {
  formatearUSD,
  formatearCOP,
  formatearPorcentaje,
  formatearCantidad,
  colorRentabilidad
} from '@/lib/formato'

export default async function ActivoPage({ params }) {
  const { symbol } = await params
  const activo = await getActivo(symbol)

  if (!activo) notFound()

  const operaciones = await getOperacionesPorActivo(symbol)
  const { positions } = await getPortafolio()
  const posicion = positions.find(p => p.symbol === symbol.toUpperCase())

  return (
    <main className="max-w-3xl sm:max-w-4xl xl:max-w-6xl 2xl:max-w-screen-2xl mx-auto px-6 py-8 space-y-8">

      {/* Encabezado */}
      <div className="flex items-center gap-4">
        <Link href="/portafolio" className="text-gray-400 hover:text-[#374151] text-sm transition-colors">
          ← Dashboard
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{activo.symbol}</h1>
          <p className="text-gray-500">{activo.name} · <span className="capitalize">{activo.type}</span></p>
        </div>
      </div>

      {/* Métricas de la posición */}
      {posicion ? (
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <TarjetaMetrica
            titulo="Valor actual (USD)"
            valor={formatearUSD(posicion.currentValueUSD)}
            color={posicion.profitLossUSD >= 0 ? 'green' : 'red'}
          />
          <TarjetaMetrica
            titulo="Valor actual (COP)"
            valor={formatearCOP(posicion.currentValueCOP)}
            color={posicion.profitLossUSD >= 0 ? 'green' : 'red'}
          />
          <TarjetaMetrica
            titulo="Precio promedio"
            valor={formatearUSD(posicion.avgPrice)}
            color="white"
          />
          <TarjetaMetrica
            titulo="Total compra(USD)"
            valor={formatearUSD(posicion.totalCostUSD)}
            color="white"
          />
          <TarjetaMetrica
            titulo="Total compra(COP)"
            valor={formatearCOP(posicion.totalCostCOP)}
            color="white"
          />
          <TarjetaMetrica
            titulo="Precio mercado (USD)"
            valor={formatearUSD(posicion.currentPrice)}
            color="white"
          />
          <TarjetaMetrica
            titulo="Rentabilidad (USD)"
            valor={formatearUSD(posicion.profitLossUSD)}
            color={posicion.profitLossUSD > 0 ? 'green' : posicion.profitLossUSD < 0 ? 'red' : 'white'}
          />
          <TarjetaMetrica
            titulo="Rentabilidad (COP)"
            valor={formatearCOP(posicion.profitLossCOP)}
            subtitulo={`TRM: ${posicion.trmActual ? posicion.trmActual.toFixed(2) : '—'}`}
            color={posicion.profitLossCOP > 0 ? 'green' : posicion.profitLossCOP < 0 ? 'red' : 'white'}
          />
          <TarjetaMetrica
            titulo="Rentabilidad (%)"
            valor={formatearPorcentaje(posicion.profitLossPct)}
            color={posicion.profitLossPct > 0 ? 'green' : posicion.profitLossPct < 0 ? 'red' : 'white'}
          />
          <TarjetaMetrica
            titulo="Cantidad disponible"
            valor={formatearCantidad(posicion.quantity)}
            color="white"
          />
        </section>
      ) : (
        <p className="text-gray-500">No hay posición activa para este activo.</p>
      )}

      {/* Historial de operaciones del activo */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-base font-semibold text-gray-800">Historial de operaciones</h2>
          </div>
          {operaciones.length === 0 ? (
          <p className="text-gray-500">No hay operaciones registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-[#6EEDB2]/20">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Tipo</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Cantidad</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Precio</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Total USD</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">TRM</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Total COP</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {operaciones.map((op, i) => {
                  const totalUSD = op.quantity * op.price + op.commission
                  const totalCOP = totalUSD * op.trm
                  return (
                <tr key={op.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(op.date).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    {' '}
                    <span className="text-xs text-gray-400">
                      {new Date(op.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      op.type === 'buy'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-500'
                    }`}>
                      {op.type === 'buy' ? 'Compra' : 'Venta'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-mono text-gray-600">
                    {formatearCantidad(op.quantity)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-gray-600">
                    {formatearUSD(op.price)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-gray-800">
                    {formatearUSD(totalUSD)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-gray-500">
                    {op.trm.toLocaleString('es-CO')}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-gray-600">
                    {formatearCOP(totalCOP)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <BotonEliminar id={op.id} />
                  </td>
                </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}