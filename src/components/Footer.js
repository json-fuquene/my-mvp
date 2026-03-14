import { Linkedin, Github } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 px-8 py-6 mt-12">
      <div className="max-w-3xl sm:max-w-4xl xl:max-w-6xl 2xl:max-w-screen-2xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

        <p className="text-sm text-gray-400">
          {"Designed by "}
          <a href="https://www.linkedin.com/in/tu-usuario" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:text-violet-700 font-medium transition-colors">
            {"Tu Nombre"}
          </a>
          {" - "}
          {year}
        </p>

        <div className="flex gap-4 items-center">
          <a href="https://www.linkedin.com/in/tu-usuario" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-violet-600 transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-violet-600 transition-colors">
            <Github size={20} />
          </a>
        </div>

      </div>
    </footer>
  )
}