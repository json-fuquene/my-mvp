export default function TarjetaMetrica({ titulo, valor, subtitulo, color = 'gray' }) {
  const colores = {
    gray:  'bg-gray-50 border-gray-200',
    blue:  'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red:   'bg-red-50 border-red-200',
  }

  return (
    <div className={`border rounded-lg p-4 ${colores[color]}`}>
      <p className="text-sm text-gray-500 mb-1">{titulo}</p>
      <p className="text-2xl font-bold">{valor}</p>
      {subtitulo && (
        <p className="text-sm text-gray-400 mt-1">{subtitulo}</p>
      )}
    </div>
  )
}