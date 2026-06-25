import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MapPin, Star, Clock } from "lucide-react"
import { Restaurant, Municipality } from "@prisma/client"

type RestaurantWithMunicipality = Restaurant & {
  municipality: Municipality
}

interface Props {
  searchParams: Promise<{ municipio?: string }>
}

const restaurantImages: Record<string, string> = {
  "restaurante-barichara-plaza": "https://res.cloudinary.com/dxalbznya/image/upload/v1782422294/casona_e178vc.png",
  "restaurante-leal-bucaramanga": "https://res.cloudinary.com/dxalbznya/image/upload/v1782422310/El_Viejo_Chiflas_Restaurante_Bucaramanga_Santander_4_94e75935ab_nqva1p.jpg",
  "restaurante-san-gil-aventura": "https://res.cloudinary.com/dxalbznya/image/upload/v1782422328/gringo-mike-s_cfyrxu.jpg",
}

export default async function RestaurantesPage({ searchParams }: Props) {
  const params = await searchParams
  const { municipio } = params

  const [restaurants, municipalities] = await Promise.all([
    prisma.restaurant.findMany({
      where: {
        status: "PUBLISHED",
        ...(municipio && { municipality: { slug: municipio } }),
      },
      include: { municipality: true },
      orderBy: { rating: "desc" },
    }),
    prisma.municipality.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", paddingTop: "80px" }}>

      {/* Header */}
      <div style={{ padding: "60px 24px 48px", maxWidth: "1152px", margin: "0 auto" }}>
        <p style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>
          Santander, Colombia
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, color: "#ffffff", margin: "0 0 16px", lineHeight: 1 }}>
          Restaurantes
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", margin: 0 }}>
          La mejor gastronomía típica de Santander
        </p>
      </div>

      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 24px 120px", display: "flex", gap: "40px" }}>

        {/* Sidebar */}
        <aside style={{ width: "200px", flexShrink: 0 }}>
          <div style={{ position: "sticky", top: "100px" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
              Municipio
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Link href="/restaurantes" style={{
                padding: "8px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
                textDecoration: "none",
                background: !municipio ? "#1a2e1f" : "transparent",
                color: !municipio ? "#6ee7b7" : "rgba(255,255,255,0.5)",
                border: !municipio ? "1px solid #2a4a2e" : "1px solid transparent",
              }}>
                Todos
              </Link>
              {municipalities.map((mun) => (
                <Link key={mun.id} href={`/restaurantes?municipio=${mun.slug}`} style={{
                  padding: "8px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
                  textDecoration: "none",
                  background: municipio === mun.slug ? "#1a2e1f" : "transparent",
                  color: municipio === mun.slug ? "#6ee7b7" : "rgba(255,255,255,0.5)",
                  border: municipio === mun.slug ? "1px solid #2a4a2e" : "1px solid transparent",
                }}>
                  {mun.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div style={{ flex: 1 }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginBottom: "24px" }}>
            <span style={{ color: "white", fontWeight: 600 }}>{restaurants.length}</span> restaurantes encontrados
          </p>

          {restaurants.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍽️</div>
              <h3 style={{ color: "white", fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
                No hay restaurantes disponibles
              </h3>
              <Link href="/restaurantes" style={{
                background: "#15803d", color: "white", padding: "12px 24px",
                borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px",
              }}>
                Ver todos
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {restaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RestaurantCard({ restaurant: r }: { restaurant: RestaurantWithMunicipality }) {
  const restaurantImages: Record<string, string> = {
    "restaurante-barichara-plaza": "https://res.cloudinary.com/dxalbznya/image/upload/v1782422294/casona_e178vc.png",
    "restaurante-leal-bucaramanga": "https://res.cloudinary.com/dxalbznya/image/upload/v1782422310/El_Viejo_Chiflas_Restaurante_Bucaramanga_Santander_4_94e75935ab_nqva1p.jpg",
    "restaurante-san-gil-aventura": "https://res.cloudinary.com/dxalbznya/image/upload/v1782422328/gringo-mike-s_cfyrxu.jpg",
  }

  return (
    <Link
      href={`/restaurantes/${r.slug}`}
      style={{ textDecoration: "none", display: "block", borderRadius: "16px", overflow: "hidden", background: "#1a1a1a", border: "1px solid #2a2a2a" }}
    >
      {/* Imagen */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${restaurantImages[r.slug] || ""}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#1a1a1a",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: "12px", left: "12px" }}>
          <span style={{
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
            border: "0.5px solid rgba(255,255,255,0.25)",
            color: "white", fontSize: "11px", fontWeight: 600,
            padding: "4px 10px", borderRadius: "20px",
          }}>
            {r.foodType}
          </span>
        </div>
        {r.rating > 0 && (
          <div style={{ position: "absolute", bottom: "12px", right: "12px", display: "flex", alignItems: "center", gap: "4px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: "10px", padding: "5px 10px" }}>
            <Star size={12} color="#fbbf24" fill="#fbbf24" />
            <span style={{ color: "white", fontWeight: 700, fontSize: "13px" }}>{r.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "18px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "16px", fontWeight: 700, margin: "0 0 6px" }}>
          {r.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "12px" }}>
          <MapPin size={12} />
          <span>{r.municipality.name}</span>
        </div>
        {r.specialties.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
              Especialidades
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {r.specialties.slice(0, 2).map((s, i) => (
                <span key={i} style={{
                  background: "#141414", border: "1px solid #2a2a2a",
                  color: "rgba(255,255,255,0.45)", fontSize: "11px",
                  padding: "3px 8px", borderRadius: "20px",
                }}>
                  {s}
                </span>
              ))}
              {r.specialties.length > 2 && (
                <span style={{
                  background: "#141414", border: "1px solid #2a2a2a",
                  color: "rgba(255,255,255,0.3)", fontSize: "11px",
                  padding: "3px 8px", borderRadius: "20px",
                }}>
                  +{r.specialties.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #2a2a2a" }}>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>Precio promedio</span>
          <span style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>${r.priceAvg.toLocaleString("es-CO")}</span>
        </div>
        {r.schedule && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
            <Clock size={11} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.schedule}</span>
          </div>
        )}
      </div>
    </Link>
  )
}