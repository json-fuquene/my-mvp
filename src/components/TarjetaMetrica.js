export default function TarjetaMetrica({ titulo, valor, subtitulo, color = 'gray' }) {
  const estilos = {
    gray:  'bg-[#56657B]',
    white: 'bg-white',
    green: 'bg-white',
    red:   'bg-white',
  }

  const coloresValor = {
    gray:  'text-[#6EEDB2]',
    white:  'text-[#314158]',
    green: 'text-[#31D492]',
    red:   'text-[#C11007]',
  }

  return (
    <div className={`${estilos[color]} rounded-2xl p-5 shadow-sm`}>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
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