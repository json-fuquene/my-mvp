import { Linkedin, Github } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#6EEDB2] w-full px-6 xl:px-12 2xl:px-24 py-3">
      <div className="flex flex-row justify-between items-center">
        <p className="text-sm text-gray-700">
          {"Designed by "}
          <a href="https://www.linkedin.com/in/tu-usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-800 hover:text-gray-900 transition-colors">
            {"Jeisson Fuquene"}
          </a>
          {" - "}
          {year}
        </p>

        <div className="flex gap-4 items-center">
          <a href="https://www.linkedin.com/in/jeisson-fuquene/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 transition-colors">
            <Linkedin size={18} />
          </a>
          <a href="https://github.com/json-fuquene"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 transition-colors">
            <Github size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}