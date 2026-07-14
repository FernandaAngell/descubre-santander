import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MapPin, Building, UtensilsCrossed, Users, Plus } from "lucide-react"

export default async function AdminPage() {
  const [places, accommodations, restaurants, users] = await Promise.all([
    prisma.place.count(),
    prisma.accommodation.count(),
    prisma.restaurant.count(),
    prisma.user.count(),
  ])

  const stats = [
    { label: "Lugares", value: places, icon: MapPin, color: "#6ee7b7" },
    { label: "Alojamientos", value: accommodations, icon: Building, color: "#a78bfa" },
    { label: "Restaurantes", value: restaurants, icon: UtensilsCrossed, color: "#fb923c" },
    { label: "Usuarios", value: users, icon: Users, color: "#60a5fa" },
  ]

  const actions = [
    { href: "/admin/lugares/nuevo", label: "Agregar lugar", desc: "Crear nuevo destino turístico", color: "#15803d", icon: MapPin },
    { href: "/admin/alojamientos/nuevo", label: "Agregar alojamiento", desc: "Crear nuevo alojamiento", color: "#7c3aed", icon: Building },
    { href: "/admin/restaurantes/nuevo", label: "Agregar restaurante", desc: "Crear nuevo restaurante", color: "#c2410c", icon: UtensilsCrossed },
  ]

  return (
    <div>
      <div style={{ marginBottom: "40px" }}>
        <p style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>
          Panel de control
        </p>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: 700, margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
          Dashboard
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
          Resumen general de la plataforma
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: "#1a1a1a", borderRadius: "16px", padding: "24px", border: "1px solid #2a2a2a" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: `${stat.color}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "16px",
            }}>
              <stat.icon size={18} color={stat.color} />
            </div>
            <div style={{ color: "white", fontSize: "32px", fontWeight: 700, marginBottom: "4px" }}>{stat.value}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Acciones */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>
          Acciones rápidas
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {actions.map((action) => (
            <Link key={action.href} href={action.href} style={{
              background: "#1a1a1a",
              border: `1px solid #2a2a2a`,
              borderRadius: "16px", padding: "24px",
              textDecoration: "none", display: "block",
              transition: "all 0.2s",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: `${action.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "16px",
              }}>
                <action.icon size={18} color={action.color} />
              </div>
              <div style={{ color: "white", fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>
                {action.label}
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>
                {action.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Links gestión */}
      <div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>
          Gestionar contenido
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { href: "/admin/lugares", label: "Ver todos los lugares", count: places },
            { href: "/admin/alojamientos", label: "Ver todos los alojamientos", count: accommodations },
            { href: "/admin/restaurantes", label: "Ver todos los restaurantes", count: restaurants },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#1a1a1a", borderRadius: "12px", padding: "16px 20px",
              border: "1px solid #2a2a2a", textDecoration: "none",
            }}>
              <span style={{ color: "white", fontSize: "14px", fontWeight: 500 }}>{item.label}</span>
              <span style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "14px" }}>{item.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}