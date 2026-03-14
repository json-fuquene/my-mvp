import Link from 'next/link'
import BotonExportar from './BotonExportar'
import { getOperaciones } from '@/lib/actions'
import { formatearUSD, formatearCOP, formatearCantidad } from '@/lib/formato'

export default async function OperacionesPage() {
  const operaciones = await getOperaciones()

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historial de operaciones</h1>
        <div className="flex gap-2">
          <BotonExportar />
        </div>
      </div>

      {operaciones.length === 0 ? (
        <p className="text-gray-500">No hay operaciones registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-3 border-b">Fecha</th>
                <th className="p-3 border-b">Activo</th>
                <th className="p-3 border-b">Tipo</th>
                <th className="p-3 border-b text-right">Cantidad</th>
                <th className="p-3 border-b text-right">Precio</th>
                <th className="p-3 border-b text-right">Comisión</th>
                <th className="p-3 border-b text-right">Total USD</th>
                <th className="p-3 border-b text-right">TRM</th>
                <th className="p-3 border-b text-right">Total COP</th>
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
                      <Link
                        href={`/portafolio/${op.assetSymbol}`}
                        className="font-medium hover:text-blue-600"
                      >
                        {op.assetSymbol}
                      </Link>
                      <span className="text-gray-400 ml-2 text-xs">
                        {op.asset.name}
                      </span>
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