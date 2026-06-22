"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/lugares", label: "Lugares" },
  { href: "/alojamientos", label: "Alojamientos" },
  { href: "/restaurantes", label: "Restaurantes" },
  { href: "/municipios", label: "Municipios" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600">
            <MapPin className="w-6 h-6" />
            <span>Descubre Santander</span>
          </Link>

          {/* Links escritorio */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Botones escritorio */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/login"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Registrarse
            </Link>
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Abrir menú"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={cn(
        "md:hidden border-t border-gray-100 bg-white transition-all duration-300",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-emerald-600 font-medium py-2 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-emerald-600 font-medium py-2 transition-colors duration-200"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg text-center transition-colors duration-200"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}