"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, MapPin, Heart, LogOut, User, Settings, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

const navLinks = [
  { href: "/lugares", label: "Lugares" },
  { href: "/alojamientos", label: "Alojamientos" },
  { href: "/restaurantes", label: "Restaurantes" },
  { href: "/municipios", label: "Municipios" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled
        ? "bg-white shadow-sm border-b border-gray-100"
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
              scrolled ? "bg-emerald-700" : "bg-white/20 backdrop-blur-sm"
            )}>
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className={cn(
              "font-semibold text-lg tracking-tight transition-colors",
              scrolled ? "text-gray-900" : "text-white"
            )}>
              Descubre <span className={scrolled ? "text-emerald-700" : "text-emerald-300"}>Santander</span>
            </span>
          </Link>

          {/* Links escritorio */}
<div className="hidden md:flex items-center gap-15">
  {navLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      style={{
        fontSize: "14px",
        fontWeight: "600",
        transition: "color 0.2s",
        color: scrolled ? "#374151" : "rgba(255,255,255,0.85)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = scrolled ? "#15803d" : "#ffffff"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = scrolled ? "#374151" : "rgba(255,255,255,0.85)"
      }}
    >
      {link.label}
    </Link>
  ))}
</div>

          {/* Botones escritorio */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                    scrolled
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      : "bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white"
                  )}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "Usuario"}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-52 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-semibold text-gray-900">{session.user?.name}</div>
                      <div className="text-xs text-gray-500">{session.user?.email}</div>
                    </div>
                    <Link
                      href="/favoritos"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-400" />
                      Mis favoritos
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        Panel admin
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={cn(
                    "text-sm font-medium transition-colors",
                    scrolled ? "text-gray-700 hover:text-emerald-700" : "text-white/90 hover:text-white"
                  )}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
            )}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={cn(
        "md:hidden bg-white border-t border-gray-100 transition-all duration-300",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-emerald-700 font-medium py-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            {session ? (
              <>
                <Link href="/favoritos" onClick={() => setIsOpen(false)} className="text-gray-700 font-medium py-2">Mis favoritos</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-red-500 font-medium py-2 text-left">Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="text-gray-700 font-medium py-2">Iniciar sesión</Link>
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-full text-center">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}