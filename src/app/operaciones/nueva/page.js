import { getActivos, crearOperacion, crearActivo } from '@/lib/actions'
import FormularioOperacion from './FormularioOperacion'

export default async function NuevaOperacionPage() {
  const activos = await getActivos()

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Nueva Operación</h1>
      <FormularioOperacion
        activos={activos}
        crearOperacion={crearOperacion}
        crearActivo={crearActivo}
      />
    </main>
  )
}