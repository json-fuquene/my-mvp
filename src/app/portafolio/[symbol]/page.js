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
    <main className="max-w-4xl mx-auto p-6 space-y-8">

      {/* Encabezado */}
      <div className="flex items-center gap-4">
        <Link href="/portafolio" className="text-gray-400 hover:text-gray-600 text-sm">
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
            titulo="Cantidad disponible"
            valor={formatearCantidad(posicion.quantity)}
            color="blue"
          />
          <TarjetaMetrica
            titulo="Precio promedio"
            valor={formatearUSD(posicion.avgPrice)}
            color="blue"
          />
          <TarjetaMetrica
            titulo="Precio actual (USD)"
            valor={formatearUSD(posicion.currentPrice)}
            color="gray"
          />
          <TarjetaMetrica
            titulo="Total (USD)"
            valor={formatearUSD(posicion.totalCostUSD)}
            color="blue"
          />
          <TarjetaMetrica
            titulo="Total (COP)"
            valor={formatearCOP(posicion.totalCostCOP)}
            color="gray"
          />
          
          <TarjetaMetrica
            titulo="Precio actual (USD)"
            valor={formatearUSD(posicion.currentValueUSD)}
            color={posicion.profitLossUSD >= 0 ? 'green' : 'red'}
          />
          <TarjetaMetrica
            titulo="Precio actual (COP)"
            valor={formatearCOP(posicion.currentValueCOP)}
            color={posicion.profitLossUSD >= 0 ? 'green' : 'red'}
          />
          <TarjetaMetrica
            titulo="Rentabilidad (COP)"
            valor={formatearCOP(posicion.profitLossCOP)}
            subtitulo={`TRM: ${posicion.trmActual ? posicion.trmActual.toFixed(2) : '—'}`}
            color={posicion.profitLossCOP > 0 ? 'green' : posicion.profitLossCOP < 0 ? 'red' : 'gray'}
          />
          <TarjetaMetrica
            titulo="Rentabilidad (USD)"
            valor={formatearUSD(posicion.profitLossUSD)}
            color={posicion.profitLossUSD > 0 ? 'green' : posicion.profitLossUSD < 0 ? 'red' : 'gray'}
          />
          <TarjetaMetrica
            titulo="Rentabilidad (%)"
            valor={formatearPorcentaje(posicion.profitLossPct)}
            color={posicion.profitLossPct > 0 ? 'green' : posicion.profitLossPct < 0 ? 'red' : 'gray'}
          />
        </section>
      ) : (
        <p className="text-gray-500">No hay posición activa para este activo.</p>
      )}

      {/* Historial de operaciones del activo */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Historial de operaciones</h2>

        {operaciones.length === 0 ? (
          <p className="text-gray-500">No hay operaciones registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="p-3 border-b">Fecha</th>
                  <th className="p-3 border-b">Tipo</th>
                  <th className="p-3 border-b text-right">Cantidad</th>
                  <th className="p-3 border-b text-right">Precio</th>
                  <th className="p-3 border-b text-right">Comisión</th>
                  <th className="p-3 border-b text-right">Total USD</th>
                  <th className="p-3 border-b text-right">TRM</th>
                  <th className="p-3 border-b text-right">Total COP</th>
                  <th className="p-3 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {operaciones.map((op) => {
                  const totalUSD = op.quantity * op.price + op.commission
                  const totalCOP = totalUSD * op.trm
                  return (
                    <tr key={op.id} className="hover:bg-gray-50 text-sm">
                      <td className="p-3 border-b">
                        {new Date(op.date).toLocaleDateString('es-CO')}
                      </td>
                      <td className="p-3 border-b">
                        <span className={op.type === 'buy'
                          ? 'text-green-600 font-medium'
                          : 'text-red-600 font-medium'
                        }>
                          {op.type === 'buy' ? 'Compra' : 'Venta'}
                        </span>
                      </td>
                      <td className="p-3 border-b text-right font-mono">
                        {formatearCantidad(op.quantity)}
                      </td>
                      <td className="p-3 border-b text-right">
                        {formatearUSD(op.price)}
                      </td>
                      <td className="p-3 border-b text-right">
                        {formatearUSD(op.commission)}
                      </td>
                      <td className="p-3 border-b text-right font-medium">
                        {formatearUSD(totalUSD)}
                      </td>
                      <td className="p-3 border-b text-right">
                        {op.trm.toLocaleString('es-CO')}
                      </td>
                      <td className="p-3 border-b text-right">
                        {formatearCOP(totalCOP)}
                      </td>
                      <td className="p-3 border-b text-center">
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