import './globals.css'
import NavBar from '@/components/NavBar'

export const metadata = {
  title: 'Mi Portafolio',
  description: 'Control de inversiones personal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        <NavBar />
        {children}
      </body>
    </html>
  )
}