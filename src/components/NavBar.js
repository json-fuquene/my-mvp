import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-gray-100 px-6 xl:px-12 2xl:px-24 py-4 flex gap-8 items-center">
      <span className="font-bold text-lg tracking-tight text-gray-900">
        📈 Mi Portafolio
      </span>
      <div className="flex gap-6 items-center">
        <Link
          href="/portafolio"
          className="text-gray-500 hover:text-violet-600 font-medium text-sm transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/operaciones"
          className="text-gray-500 hover:text-violet-600 font-medium text-sm transition-colors"
        >
          Operaciones
        </Link>
      </div>
      <div className="ml-auto">
        <Link
          href="/operaciones/nueva"
          className="bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 text-sm font-semibold transition-colors shadow-sm"
        >
          + Nueva operación
        </Link>
      </div>
    </nav>
  )
}