import { getPortafolio } from '@/lib/actions'
import TarjetaMetrica from '@/components/TarjetaMetrica'
import GraficaDistribucion from '@/components/GraficaDistribucion'
import Link from 'next/link'
import {
  formatearUSD,
  formatearCOP,
  formatearTRM,
  formatearPorcentaje,
  formatearCantidad,
  colorRentabilidad
} from '@/lib/formato'

export default async function PortafolioPage() {
  const { positions, summary } = await getPortafolio()

  return (
    <div className="max-w-3xl sm:max-w-4xl xl:max-w-6xl 2xl:max-w-screen-2xl mx-auto px-6 py-8 space-y-8">

      {/* Título */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-400 mt-1">
            TRM actual:{' '}
            <span className="font-medium text-gray-600">
              {summary.trmActual ? formatearTRM(summary.trmActual) : '—'}
            </span>
          </p>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <section className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-4 gap-4 2xl:gap-6">
        <TarjetaMetrica
          titulo="Total invertido"
          valor={formatearUSD(summary.totalCostUSD)}
          subtitulo={formatearCOP(summary.totalCostCOP)}
          color="gray"
        />
        <TarjetaMetrica
          titulo="Valor actual"
          valor={formatearUSD(summary.totalCurrentValueUSD)}
          subtitulo={formatearCOP(summary.totalCurrentValueCOP)}
          color="gray"
        />
        <TarjetaMetrica
          titulo="Rentabilidad"
          valor={formatearPorcentaje(summary.totalProfitLossPct)}
          subtitulo={formatearUSD(summary.totalProfitLossUSD)}
          color={summary.totalProfitLossPct > 0 ? 'green' : summary.totalProfitLossPct < 0 ? 'red' : 'gray'}
        />
        <TarjetaMetrica
          titulo="Posiciones activas"
          valor={positions.length}
          color="white"
        />
      </section>

      {/* Tabla + Gráfica lado a lado */}
      <section className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Tabla de posiciones — ocupa 2/3 */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden min-w-0">
          <div className="overflow-x-auto">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-base font-semibold text-gray-800">Posiciones actuales</h2>
          </div>

          {positions.length === 0 ? (
            <p className="text-gray-400 text-sm p-6">No hay posiciones activas.</p>
          ) : (
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-[#6EEDB2]/20">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Activo</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Cantidad</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Precio actual</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Valor (USD)</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Exposición</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Rentabilidad</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos, i) => (
                  <tr
                    key={pos.symbol}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  >
                    <td className="px-6 py-4">
                      <Link href={`/portafolio/${pos.symbol}`} className="hover:text-[#374151] hover:underline">
                        <span className="font-semibold text-gray-900">{pos.symbol}</span>
                        <span className="text-gray-400 text-xs ml-2">{pos.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-600 font-mono">
                      {formatearCantidad(pos.quantity)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-600">
                      {formatearUSD(pos.currentPrice)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-gray-800">
                      {formatearUSD(pos.currentValueUSD)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-500">
                      {formatearPorcentaje(pos.exposurePct)}
                    </td>
                    <td className={`px-6 py-4 text-right text-sm font-semibold ${colorRentabilidad(pos.profitLossPct)}`}>
                      {formatearPorcentaje(pos.profitLossPct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          </div>
        </div>

        {/* Gráfica — ocupa 1/3 */}
        {positions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:w-80 lg:sticky lg:top-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Distribución</h2>
            <GraficaDistribucion positions={positions} />
          </div>
        )}

      </section>

      {/* Distribución por tipo */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-3">Por tipo de activo</h2>
        <div className="flex gap-3 flex-wrap">
          {['stock', 'etf', 'crypto'].map(tipo => {
            const posicionesTipo = positions.filter(p => p.type === tipo)
            if (posicionesTipo.length === 0) return null
            const costoTipo = posicionesTipo.reduce((sum, p) => sum + p.totalCostUSD, 0)
            const pct = summary.totalCostUSD > 0
              ? ((costoTipo / summary.totalCostUSD) * 100).toFixed(1)
              : 0
            return (
              <div key={tipo} className="bg-white rounded-2xl shadow-sm px-5 py-4 min-w-36">
                <p className="text-xs text-gray-400 uppercase tracking-wide capitalize">{tipo}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{pct}%</p>
                <p className="text-xs text-gray-400 mt-1">{formatearUSD(costoTipo)}</p>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  )
}