import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-white border-b px-6 py-3 flex gap-6 items-center">
      <span className="font-bold text-lg">📈 Mi Portafolio</span>
      <Link href="/portafolio" className="text-gray-600 hover:text-blue-600">
        Dashboard
      </Link>
      <Link href="/operaciones" className="text-gray-600 hover:text-blue-600">
        Operaciones
      </Link>
      <Link href="/operaciones/nueva" className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm">
        + Nueva operación
      </Link>
    </nav>
  )
}