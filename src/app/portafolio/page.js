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
    <main className="max-w-5xl mx-auto p-6 space-y-8">

    {/* Título */}
    <h1 className="text-2xl font-bold">Dashboard</h1>

    {/* TRM actual */}
    <div className="flex items-center gap-2 text-sm text-gray-500">
    <span>TRM actual:</span>
    <span className="font-medium text-gray-700">
        {summary.trmActual
        ? formatearTRM(summary.trmActual)
        : '—'}
    </span>
    <span className="text-xs text-gray-400">(actualizada cada hora)</span>
    </div>

    {/* Tarjetas de resumen */}
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <TarjetaMetrica
        titulo="Total invertido (USD)"
        valor={formatearUSD(summary.totalCostUSD)}
        color="blue"
    />
    <TarjetaMetrica
        titulo="Total invertido (COP)"
        valor={formatearCOP(summary.totalCostCOP)}
        color="blue"
    />
    <TarjetaMetrica
        titulo="Valor actual (USD)"
        valor={formatearUSD(summary.totalCurrentValueUSD)}
        subtitulo={formatearCOP(summary.totalCurrentValueCOP)}
        color="gray"
    />
    <TarjetaMetrica
        titulo="Rentabilidad total"
        valor={formatearPorcentaje(summary.totalProfitLossPct)}
        subtitulo={`${formatearUSD(summary.totalProfitLossUSD)} · ${formatearCOP(summary.totalProfitLossCOP)}`}
        color={summary.totalProfitLossPct > 0 ? 'green' : summary.totalProfitLossPct < 0 ? 'red' : 'gray'}
    />
    </section>

    {/* Tabla de posiciones */}
    <section>
    <h2 className="text-lg font-semibold mb-3">Posiciones actuales</h2>

    {positions.length === 0 ? (
        <p className="text-gray-500">No hay posiciones activas.</p>
    ) : (
        <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
            <tr className="bg-gray-100 text-left text-sm">
                <th className="p-3 border-b">Activo</th>
                <th className="p-3 border-b">Tipo</th>
                <th className="p-3 border-b text-right">Cantidad</th>
                <th className="p-3 border-b text-right">Precio actual</th>
                <th className="p-3 border-b text-right">Total USD</th>
                <th className="p-3 border-b text-right">Total COP</th>
                <th className="p-3 border-b text-right">Exposición</th>
                <th className="p-3 border-b text-right">Rentabilidad</th>
            </tr>
            </thead>
            <tbody>
            {positions.map((pos) => (
                <tr key={pos.symbol} className="hover:bg-gray-50 text-sm">
                <td className="p-3 border-b">
                    <Link
                        href={`/portafolio/${pos.symbol}`}
                        className="font-bold hover:text-blue-600"
                    >
                        {pos.symbol}
                    </Link>
                    <span className="text-gray-400 ml-2 text-xs">{pos.name}</span>
                    </td>
                <td className="p-3 border-b text-gray-500 capitalize">{pos.type}</td>
                <td className="p-3 border-b text-right font-mono">
                    {formatearCantidad(pos.quantity)}
                </td>
                <td className="p-3 border-b text-right">
                    {formatearUSD(pos.currentPrice)}
                </td>
                <td className="p-3 border-b text-right">
                    {formatearUSD(pos.totalCostUSD)}
                </td>
                <td className="p-3 border-b text-right">
                    {formatearCOP(pos.totalCostCOP)}
                </td>
                <td className="p-3 border-b text-right">
                    {formatearPorcentaje(pos.exposurePct)}
                </td>
                <td className={`p-3 border-b text-right font-medium ${colorRentabilidad(pos.profitLossPct)}`}>
                    {formatearPorcentaje(pos.profitLossPct)}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    )}
    </section>
    
    {/* Gráfica de distribución */}
    {positions.length > 0 && (
    <section>
        <h2 className="text-lg font-semibold mb-3">Distribución del portafolio</h2>
        <div className="bg-white rounded-lg shadow-sm p-6">
        <GraficaDistribucion positions={positions} />
        </div>
    </section>
    )}

    {/* Distribución por tipo de activo */}
    <section>
    <h2 className="text-lg font-semibold mb-3">Distribución por tipo</h2>
    <div className="flex gap-4 flex-wrap">
        {['stock', 'etf', 'crypto'].map(tipo => {
        const posicionesTipo = positions.filter(p => p.type === tipo)
        if (posicionesTipo.length === 0) return null
        const costoTipo = posicionesTipo.reduce((sum, p) => sum + p.totalCostUSD, 0)
        const pct = summary.totalCostUSD > 0
            ? ((costoTipo / summary.totalCostUSD) * 100).toFixed(1)
            : 0
        return (
            <div key={tipo} className="bg-white border rounded-lg p-4 min-w-32">
            <p className="text-sm text-gray-500 capitalize">{tipo}</p>
            <p className="text-xl font-bold">{pct}%</p>
            <p className="text-xs text-gray-400">{formatearUSD(costoTipo)}</p>
            </div>
        )
        })}
    </div>
    </section>

    </main>
  )
}