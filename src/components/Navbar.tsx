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
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", height: "80px", position: "relative" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", minWidth: "220px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#15803d", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MapPin size={16} color="white" />
            </div>
            <span style={{ fontSize: "16px", fontWeight: 600, color: "white", letterSpacing: "-0.3px" }}>
              Descubre <span style={{ color: "#6ee7b7" }}>Santander</span>
            </span>
          </Link>

          {/* Links — centro absoluto */}
          <div style={{
            position: "absolute", left: "50%", transform: "translateX(-50%)",
            display: "flex", alignItems: "center", gap: "36px",
          }} className="hidden md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff" }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.8)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Botones — derecha */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }} className="hidden md:flex">
            {session ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "8px 14px", borderRadius: "20px",
                    background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "white", cursor: "pointer", fontSize: "13px", fontWeight: 500,
                  }}
                >
                  {session.user?.image ? (
                    <Image src={session.user.image} alt={session.user.name ?? "U"} width={22} height={22} style={{ borderRadius: "50%" }} />
                  ) : (
                    <User size={16} />
                  )}
                  {session.user?.name?.split(" ")[0]}
                  <ChevronDown size={12} />
                </button>

                {showUserMenu && (
                  <div style={{
                    position: "absolute", right: 0, top: "48px",
                    background: "#1a1a1a", borderRadius: "16px",
                    border: "1px solid #2a2a2a",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                    padding: "8px", width: "220px", zIndex: 50,
                  }}>
                    <div style={{ padding: "12px 14px", borderBottom: "1px solid #2a2a2a", marginBottom: "4px" }}>
                      <div style={{ color: "white", fontSize: "13px", fontWeight: 600 }}>{session.user?.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>{session.user?.email}</div>
                    </div>
                    <Link href="/favoritos" onClick={() => setShowUserMenu(false)} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "10px 14px", borderRadius: "10px",
                      textDecoration: "none", color: "rgba(255,255,255,0.6)",
                      fontSize: "13px", fontWeight: 500,
                    }}>
                      <Heart size={14} color="#f87171" />
                      Mis favoritos
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link href="/admin" onClick={() => setShowUserMenu(false)} style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 14px", borderRadius: "10px",
                        textDecoration: "none", color: "rgba(255,255,255,0.6)",
                        fontSize: "13px", fontWeight: 500,
                      }}>
                        <Settings size={14} color="rgba(255,255,255,0.4)" />
                        Panel admin
                      </Link>
                    )}
                    <div style={{ borderTop: "1px solid #2a2a2a", marginTop: "4px", paddingTop: "4px" }}>
                      <button onClick={() => signOut({ callbackUrl: "/" })} style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 14px", borderRadius: "10px",
                        color: "#f87171", fontSize: "13px", fontWeight: 500,
                        background: "none", border: "none", cursor: "pointer",
                        width: "100%", textAlign: "left",
                      }}>
                        <LogOut size={14} />
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
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#16a34a",
    color: "white",
    fontSize: "14px",
    fontWeight: 600,
    padding: "11px 24px",
    borderRadius: "999px",
    textDecoration: "none",
    transition: "all .25s ease",
    boxShadow: "0 8px 25px rgba(22,163,74,.25)"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#22c55e"
    e.currentTarget.style.transform = "translateY(-2px)"
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#16a34a"
    e.currentTarget.style.transform = "translateY(0)"
  }}
>
  Iniciar sesión
</Link>
              </>
            )}
          </div>

          {/* Botón móvil */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "white", cursor: "pointer", padding: "8px" }}
            className="md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={cn(
        "md:hidden border-t border-white/10 transition-all duration-300",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )} style={{ background: "rgba(10,10,10,0.98)" }}>
        <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} style={{
              color: "rgba(255,255,255,0.7)", fontWeight: 500, padding: "10px 0",
              textDecoration: "none", fontSize: "15px",
            }}>
              {link.label}
            </Link>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "8px", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {session ? (
              <>
                <Link href="/favoritos" onClick={() => setIsOpen(false)} style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500, padding: "8px 0", textDecoration: "none" }}>Mis favoritos</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} style={{ color: "#f87171", fontWeight: 500, padding: "8px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: "15px" }}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setIsOpen(false)} style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500, padding: "8px 0", textDecoration: "none" }}>Iniciar sesión</Link>
                <Link href="/auth/login" onClick={() => setIsOpen(false)} style={{ background: "#15803d", color: "white", fontWeight: 600, padding: "10px 20px", borderRadius: "20px", textAlign: "center", textDecoration: "none" }}>Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}