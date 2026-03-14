export default function TarjetaMetrica({ titulo, valor, subtitulo, color = 'gray' }) {
  const estilos = {
    gray:  'bg-white',
    blue:  'bg-white',
    green: 'bg-white',
    red:   'bg-white',
  }

  const coloresValor = {
    gray:  'text-gray-800',
    blue:  'text-violet-600',
    green: 'text-emerald-600',
    red:   'text-red-500',
  }

  return (
    <div className={`${estilos[color]} rounded-2xl p-5 shadow-sm`}>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
        {titulo}
      </p>
      <p className={`text-2xl font-bold ${coloresValor[color]}`}>
        {valor}
      </p>
      {subtitulo && (
        <p className="text-xs text-gray-400 mt-1">{subtitulo}</p>
      )}
    </div>
  )
}