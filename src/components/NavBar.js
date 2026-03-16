'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function NavBar() {
const [menuAbierto, setMenuAbierto] = useState(false)
const menuRef = useRef(null)

useEffect(() => {
  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuAbierto(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])
  return (
    <nav className="bg-gray-100 px-6 xl:px-12 2xl:px-24 py-4 flex gap-8 items-center">
      <span className="font-bold text-lg tracking-tight text-gray-900">
        📈 Mi Portafolio
      </span>
      <div className="flex gap-6 items-center">
        <Link
          href="/portafolio"
          className="text-gray-700 hover:text-gray-900 font-semibold text-sm transition-colors"
        >
          Home
        </Link>
        <Link
          href="/operaciones"
          className="text-gray-700 hover:text-gray-900 font-semibold text-sm transition-colors"
        >
          Operaciones
        </Link>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-semibold text-sm transition-colors"
          >
            Activos
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${menuAbierto ? 'rotate-180' : ''}`}
            />
          </button>

          {menuAbierto && (
            <div className="absolute top-8 left-0 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-40 z-50">
              {[
                { href: '/activos/crypto', label: '🪙 Cripto'   },
                { href: '/activos/stock',  label: '📊 Acciones' },
                { href: '/activos/etf',    label: '📦 ETFs'     },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuAbierto(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#6EEDB2]/20 hover:text-gray-900 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="ml-auto">
        <Link
          href="/operaciones/nueva"
          className="bg-[#374151] text-white px-4 py-2 rounded-xl hover:bg-gray-900 text-sm font-semibold transition-colors shadow-sm"
        >
          + Nueva operación
        </Link>
      </div>
    </nav>
  )
}