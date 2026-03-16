import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta'
})

export const metadata = {
  title: 'Mi Portafolio',
  description: 'Control de inversiones personal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body className="bg-gray-100 min-h-screen flex flex-col font-jakarta antialiased">
        <NavBar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}