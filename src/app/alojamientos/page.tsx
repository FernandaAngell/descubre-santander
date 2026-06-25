import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MapPin, Users } from "lucide-react"
import { Accommodation, Municipality } from "@prisma/client"

type AccommodationWithMunicipality = Accommodation & {
  municipality: Municipality
}

interface Props {
  searchParams: Promise<{ tipo?: string; municipio?: string }>
}

const tipoLabels: Record<string, string> = {
  GLAMPING: "Glamping",
  HOTEL: "Hotel",
  CABANA: "Cabaña",
  HOSTAL: "Hostal",
}

const idealForLabels: Record<string, string> = {
  PAREJAS: "Parejas",
  FAMILIAS: "Familias",
  GRUPOS: "Grupos",
  TODOS: "Todos",
}

const accommodationImages: Record<string, string> = {
  "hostal-barichara-colonial": "https://res.cloudinary.com/dxalbznya/image/upload/v1782421718/hostal_u1cxeo.jpg",
  "hotel-ruitoque": "https://res.cloudinary.com/dxalbznya/image/upload/v1782421739/hotel_campestre_ruitoque_qsuubp.jpg",
  "glamping-la-piramide": "https://res.cloudinary.com/dxalbznya/image/upload/v1782421760/La_Piramide_Parque_1_313f673f13_qawgps.jpg",
  "glamping-monte-azul": "https://res.cloudinary.com/dxalbznya/image/upload/v1782421776/monte_azul_ngga7n.jpg",
}

const tipos = ["GLAMPING", "HOTEL", "CABANA", "HOSTAL"]

export default async function AlojamientosPage({ searchParams }: Props) {
  const params = await searchParams
  const { tipo, municipio } = params

  const [accommodations, municipalities] = await Promise.all([
    prisma.accommodation.findMany({
      where: {
        status: "PUBLISHED",
        ...(tipo && { type: tipo as any }),
        ...(municipio && { municipality: { slug: municipio } }),
      },
      include: { municipality: true },
      orderBy: { createdAt: "desc" },
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
          Alojamientos
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", margin: "0 0 32px" }}>
          Glampings, hoteles, cabañas y hostales en Santander
        </p>

        {/* Filtros tipo */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Link href="/alojamientos" style={{
            padding: "8px 20px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
            background: !tipo ? "#15803d" : "#1a1a1a",
            color: !tipo ? "white" : "rgba(255,255,255,0.5)",
            border: !tipo ? "1px solid #15803d" : "1px solid #2a2a2a",
            transition: "all 0.2s",
          }}>
            Todos
          </Link>
          {tipos.map((t) => (
            <Link key={t} href={`/alojamientos?tipo=${t}${municipio ? `&municipio=${municipio}` : ""}`} style={{
              padding: "8px 20px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              background: tipo === t ? "#15803d" : "#1a1a1a",
              color: tipo === t ? "white" : "rgba(255,255,255,0.5)",
              border: tipo === t ? "1px solid #15803d" : "1px solid #2a2a2a",
              transition: "all 0.2s",
            }}>
              {tipoLabels[t]}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 24px 120px", display: "flex", gap: "40px" }}>

        {/* Sidebar */}
        <aside style={{ width: "200px", flexShrink: 0 }}>
          <div style={{ position: "sticky", top: "100px" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
              Municipio
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Link href={tipo ? `/alojamientos?tipo=${tipo}` : "/alojamientos"} style={{
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                background: !municipio ? "#1a2e1f" : "transparent",
                color: !municipio ? "#6ee7b7" : "rgba(255,255,255,0.5)",
                border: !municipio ? "1px solid #2a4a2e" : "1px solid transparent",
              }}>
                Todos
              </Link>
              {municipalities.map((mun) => (
                <Link key={mun.id} href={`/alojamientos?municipio=${mun.slug}${tipo ? `&tipo=${tipo}` : ""}`} style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
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
            <span style={{ color: "white", fontWeight: 600 }}>{accommodations.length}</span> alojamientos encontrados
          </p>

          {accommodations.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏕️</div>
              <h3 style={{ color: "white", fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
                No hay alojamientos disponibles
              </h3>
              <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>Intenta con otros filtros</p>
              <Link href="/alojamientos" style={{
                background: "#15803d", color: "white", padding: "12px 24px",
                borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px",
              }}>
                Ver todos
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
              {accommodations.map((acc) => (
                <AccommodationCard key={acc.id} accommodation={acc} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AccommodationCard({ accommodation: acc }: { accommodation: AccommodationWithMunicipality }) {
  const accommodationImages: Record<string, string> = {
    "hostal-barichara-colonial": "https://res.cloudinary.com/dxalbznya/image/upload/v1782421718/hostal_u1cxeo.jpg",
    "hotel-ruitoque": "https://res.cloudinary.com/dxalbznya/image/upload/v1782421739/hotel_campestre_ruitoque_qsuubp.jpg",
    "glamping-la-piramide": "https://res.cloudinary.com/dxalbznya/image/upload/v1782421760/La_Piramide_Parque_1_313f673f13_qawgps.jpg",
    "glamping-monte-azul": "https://res.cloudinary.com/dxalbznya/image/upload/v1782421776/monte_azul_ngga7n.jpg",
  }

  const tipoLabels: Record<string, string> = {
    GLAMPING: "Glamping",
    HOTEL: "Hotel",
    CABANA: "Cabaña",
    HOSTAL: "Hostal",
  }

  const idealForLabels: Record<string, string> = {
    PAREJAS: "Parejas",
    FAMILIAS: "Familias",
    GRUPOS: "Grupos",
    TODOS: "Todos",
  }

  return (
    <Link
      href={`/alojamientos/${acc.slug}`}
      style={{ textDecoration: "none", display: "block", borderRadius: "16px", overflow: "hidden", background: "#1a1a1a", border: "1px solid #2a2a2a" }}
    >
      {/* Imagen */}
      <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${accommodationImages[acc.slug] || ""}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#1a2e1f",
          transition: "transform 0.5s ease",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: "12px", left: "12px" }}>
          <span style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: "0.5px solid rgba(255,255,255,0.25)",
            color: "white",
            fontSize: "11px",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "20px",
          }}>
            {tipoLabels[acc.type]}
          </span>
        </div>
        <div style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: "10px", padding: "6px 12px" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>Desde</div>
          <div style={{ color: "white", fontWeight: 700, fontSize: "15px" }}>${acc.priceMin.toLocaleString("es-CO")}</div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "20px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "17px", fontWeight: 700, margin: "0 0 6px" }}>
          {acc.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "12px" }}>
          <MapPin size={12} />
          <span>{acc.municipality.name}</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", lineHeight: 1.6, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {acc.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid #2a2a2a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
            <Users size={13} />
            <span>Ideal para {idealForLabels[acc.idealFor]}</span>
          </div>
          {acc.capacity && (
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
              Hasta {acc.capacity} personas
            </span>
          )}
        </div>
        {acc.amenities.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
            {acc.amenities.slice(0, 3).map((amenity, i) => (
              <span key={i} style={{
                background: "#141414",
                border: "1px solid #2a2a2a",
                color: "rgba(255,255,255,0.4)",
                fontSize: "11px",
                padding: "3px 10px",
                borderRadius: "20px",
              }}>
                {amenity}
              </span>
            ))}
            {acc.amenities.length > 3 && (
              <span style={{
                background: "#141414",
                border: "1px solid #2a2a2a",
                color: "rgba(255,255,255,0.4)",
                fontSize: "11px",
                padding: "3px 10px",
                borderRadius: "20px",
              }}>
                +{acc.amenities.length - 3} más
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}