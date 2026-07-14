"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MapPin, Building, UtensilsCrossed, ArrowLeft } from "lucide-react"

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/lugares", label: "Lugares", icon: MapPin },
  { href: "/admin/alojamientos", label: "Alojamientos", icon: Building },
  { href: "/admin/restaurantes", label: "Restaurantes", icon: UtensilsCrossed },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0a0a0a" }}>

      {/* Sidebar */}
      <aside style={{
        width: "220px",
        backgroundColor: "#111111",
        borderRight: "1px solid #222222",
        position: "fixed",
        top: 0, left: 0,
        height: "100vh",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Logo */}
        <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid #222222" }}>
          <div style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "15px", marginBottom: "3px" }}>
            Descubre Santander
          </div>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", letterSpacing: "1px" }}>
            PANEL ADMIN
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {adminLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#6ee7b7" : "rgba(255,255,255,0.45)",
                  background: isActive ? "#0f2318" : "transparent",
                  border: isActive ? "1px solid #1a3d2b" : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <link.icon size={15} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Volver */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid #222222" }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 14px", borderRadius: "10px",
            textDecoration: "none",
            color: "rgba(255,255,255,0.25)",
            fontSize: "13px", fontWeight: 500,
            transition: "all 0.15s",
          }}>
            <ArrowLeft size={15} />
            Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Contenido */}
      <main style={{
        marginLeft: "220px",
        flex: 1,
        padding: "48px",
        backgroundColor: "#0a0a0a",
        minHeight: "100vh",
      }}>
        {children}
      </main>
    </div>
  )
}