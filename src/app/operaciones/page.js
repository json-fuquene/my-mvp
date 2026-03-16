import Link from 'next/link'
import BotonExportar from './BotonExportar'
import BotonEliminar from './BotonEliminar'
import { getOperaciones } from '@/lib/actions'
import { formatearUSD, formatearCOP, formatearCantidad } from '@/lib/formato'

export default async function OperacionesPage() {
  const operaciones = await getOperaciones()

  return (
    <main className="max-w-3xl sm:max-w-4xl xl:max-w-6xl 2xl:max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historial de operaciones</h1>
        <div className="flex gap-2">
          <BotonExportar />
        </div>
      </div>

      {operaciones.length === 0 ? (
        <p className="text-gray-500">No hay operaciones registradas.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#6EEDB2]/20">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Activo</th>
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
                      <Link href={`/portafolio/${op.assetSymbol}`} className="hover:text-[#374151] hover:underline">
                        <span className="font-semibold text-gray-900 text-sm">{op.assetSymbol}</span>
                        <span className="text-gray-400 ml-2 text-xs">{op.asset.name}</span>
                      </Link>
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
    </main>
  )
}