import Link from 'next/link'
import { getActivos, crearOperacion, crearActivo, getTRMActual } from '@/lib/actions'
import FormularioOperacion from './FormularioOperacion'

export default async function NuevaOperacionPage() {
  const activos = await getActivos()
  const trmActual = await getTRMActual()
  const fechaHoy = new Date().toISOString().split('T')[0]

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/operaciones" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Operaciones
        </Link>
        <h1 className="text-2xl font-bold">Nueva Operación</h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <FormularioOperacion
          activos={activos}
          crearOperacion={crearOperacion}
          crearActivo={crearActivo}
          trmInicial={trmActual}
          fechaInicial={fechaHoy}
        />
      </div>
    </main>
  )
}