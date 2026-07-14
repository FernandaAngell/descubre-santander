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

  // Detectar scroll para cambiar fondo del navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cerrar el menú móvil automáticamente si se agranda la pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || isOpen
          ? "bg-black/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      )}
    >
      {/* Contenedor principal con paddings responsivos */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 md:h-20 transition-all duration-300">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 z-50 group hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center shadow-md shadow-emerald-900/30 transition-transform group-hover:scale-105 duration-300">
              <MapPin size={16} className="text-white" />
            </div>
            <span className="text-base md:text-lg font-semibold text-white tracking-tight">
              Descubre <span className="text-emerald-400 font-bold">Santander</span>
            </span>
          </Link>

          {/* Links — Centro absoluto (Solo Desktop) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
  <Link
    key={link.href}
    href={link.href}
    style={{
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: 600,
      textDecoration: "none",
      transition: "color .2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = "#6ee7b7"
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = "#ffffff"
    }}
  >
    {link.label}
  </Link>
))}
          </div>

          {/* Botones/Usuario — Derecha (Solo Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 text-white transition-all text-xs font-medium cursor-pointer"
                >
                  {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name ?? "U"} 
                      width={20} 
                      height={20} 
                      className="rounded-full object-cover" 
                    />
                  ) : (
                    <User size={14} />
                  )}
                  <span>{session.user?.name?.split(" ")[0]}</span>
                  <ChevronDown size={12} className={cn("transition-transform duration-200", showUserMenu && "rotate-180")} />
                </button>

                {showUserMenu && (
                  <>
                    {/* Overlay invisible para cerrar el menú haciendo click fuera */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-11 w-56 bg-[#161616] border border-white/15 rounded-2xl shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3.5 py-3 border-b border-white/5 mb-1.5">
                        <div className="text-xs font-semibold text-white truncate">{session.user?.name}</div>
                        <div className="text-[10px] text-white/40 truncate">{session.user?.email}</div>
                      </div>
                      <Link 
                        href="/favoritos" 
                        onClick={() => setShowUserMenu(false)} 
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 transition-all text-xs font-medium"
                      >
                        <Heart size={14} className="text-red-400" />
                        Mis favoritos
                      </Link>
                      {session.user?.role === "ADMIN" && (
                        <Link 
                          href="/admin" 
                          onClick={() => setShowUserMenu(false)} 
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 transition-all text-xs font-medium"
                        >
                          <Settings size={14} className="text-white/40" />
                          Panel admin
                        </Link>
                      )}
                      <div className="border-t border-white/5 mt-1.5 pt-1.5">
                        <button 
                          onClick={() => signOut({ callbackUrl: "/" })} 
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-xs font-medium w-full text-left cursor-pointer"
                        >
                          <LogOut size={14} />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-250 shadow-[0_8px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.35)]"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Botón menú hamburguesa (Solo Móvil) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden ml-auto p-2 text-white/80 hover:text-white active:scale-90 transition-all z-50 rounded-lg hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú desplegable Móvil */}
      <div 
        className={cn(
          "md:hidden border-t border-white/10 transition-all duration-300 ease-in-out bg-black/95 backdrop-blur-xl overflow-hidden",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="px-5 py-6 flex flex-col gap-5">
          
          {/* Información de usuario en móvil (si tiene sesión iniciada) */}
          {session && (
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              {session.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt={session.user.name ?? "U"} 
                  width={40} 
                  height={40} 
                  className="rounded-full border border-white/10" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                  <User size={20} className="text-white/60" />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">{session.user?.name}</span>
                <span className="text-xs text-white/45 truncate">{session.user?.email}</span>
              </div>
            </div>
          )}

          {/* Enlaces de Navegación principales */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
  <Link
    key={link.href}
    href={link.href}
    onClick={() => setIsOpen(false)}
    style={{
      color: "#ffffff",
      fontSize: "15px",
      fontWeight: 500,
      textDecoration: "none",
      padding: "10px 12px",
      borderRadius: "12px",
    }}
  >
    {link.label}
  </Link>
))}
          </div>

          {/* Acciones adicionales del usuario / Autenticación */}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
            {session ? (
              <>
                <Link 
                  href="/favoritos" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center gap-3 text-[15px] font-medium text-white/70 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-xl transition-all"
                >
                  <Heart size={16} className="text-red-400" />
                  Mis favoritos
                </Link>
                
                {/* Panel de administrador en menú móvil */}
                {session.user?.role === "ADMIN" && (
                  <Link 
                    href="/admin" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center gap-3 text-[15px] font-medium text-white/70 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-xl transition-all"
                  >
                    <Settings size={16} className="text-white/40" />
                    Panel admin
                  </Link>
                )}
                
                <button 
                  onClick={() => {
                    setIsOpen(false)
                    signOut({ callbackUrl: "/" })
                  }} 
                  className="flex items-center gap-3 text-[15px] font-semibold text-red-400 hover:bg-red-500/10 px-3 py-2.5 rounded-xl transition-all text-left w-full cursor-pointer mt-2"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-1">
                <Link 
                  href="/auth/login" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center justify-center text-[15px] font-medium text-white/70 hover:text-white border border-white/15 hover:border-white/30 px-4 py-2.5 rounded-full transition-all"
                >
                  Iniciar sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}