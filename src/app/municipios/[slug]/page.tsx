import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MapPin, Mountain, Thermometer, Users } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

const municipioImages: Record<string, string> = {
  "bucaramanga": "https://res.cloudinary.com/dxalbznya/image/upload/v1782423085/bucaramanga_knvql7.avif",
  "floridablanca": "https://res.cloudinary.com/dxalbznya/image/upload/v1782423044/floridabalnca_gumvyl.jpg",
  "giron": "https://res.cloudinary.com/dxalbznya/image/upload/v1782423024/giron_z3zo9z.jpg",
  "barichara": "https://res.cloudinary.com/dxalbznya/image/upload/v1782423109/barichara_nvnfci.webp",
  "san-gil": "https://res.cloudinary.com/dxalbznya/image/upload/v1782422989/san_gil_sfdnfx.jpg",
  "curiti": "https://res.cloudinary.com/dxalbznya/image/upload/v1782423067/curiti_y1qlxd.jpg",
}

const placeImages: Record<string, string> = {
  "canon-del-chicamocha": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403498/ca%C3%B1on_ejyedw.jpg",
  "barichara-pueblo": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403521/barichara_fu4npr.jpg",
  "cascada-juan-curi": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403539/cascada_juan_curi_lafsmp.jpg",
  "rafting-rio-fonce": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403585/rifting_vg7frt.png",
  "parque-wilches-bucaramanga": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403555/garcia_rovira_obkprb.jpg",
  "mirador-santander-giron": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403572/mirador_x3tndm.jpg",
}

const accommodationImages: Record<string, string> = {
  "hostal-barichara-colonial": "https://res.cloudinary.com/dxalbznya/image/upload/v1782421718/hostal_u1cxeo.jpg",
  "hotel-ruitoque": "https://res.cloudinary.com/dxalbznya/image/upload/v1782421739/hotel_campestre_ruitoque_qsuubp.jpg",
  "glamping-la-piramide": "https://res.cloudinary.com/dxalbznya/image/upload/v1782421760/La_Piramide_Parque_1_313f673f13_qawgps.jpg",
  "glamping-monte-azul": "https://res.cloudinary.com/dxalbznya/image/upload/v1782421776/monte_azul_ngga7n.jpg",
}

export default async function MunicipioDetailPage({ params }: Props) {
  const { slug } = await params

  const municipality = await prisma.municipality.findUnique({
    where: { slug },
    include: {
      places: {
        where: { status: "PUBLISHED" },
        include: { category: true },
        take: 6,
      },
      accommodations: {
        where: { status: "PUBLISHED" },
        take: 4,
      },
      restaurants: {
        where: { status: "PUBLISHED" },
        take: 4,
      },
    },
  })

  if (!municipality) notFound()

  const heroImage = municipioImages[municipality.slug] || ""

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ position: "relative", height: "70vh", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: heroImage ? `url('${heroImage}')` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#1a2e1f",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, #0a0a0a 100%)",
        }} />

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 48px" }}>
          <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
            <p style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>
              {municipality.department}, Colombia
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 700, color: "white",
              margin: "0 0 16px", lineHeight: 1,
            }}>
              {municipality.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {municipality.altitude && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>
                  <Mountain size={14} />
                  <span>{municipality.altitude}m s.n.m.</span>
                </div>
              )}
              {municipality.weather && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>
                  <Thermometer size={14} />
                  <span>{municipality.weather}</span>
                </div>
              )}
              {municipality.population && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>
                  <Users size={14} />
                  <span>{municipality.population.toLocaleString("es-CO")} hab.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 24px 120px" }}>

        {/* Descripción */}
        {municipality.description && (
          <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "28px", border: "1px solid #2a2a2a", marginBottom: "48px" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "16px", margin: 0 }}>
              {municipality.description}
            </p>
          </div>
        )}

        {/* Lugares */}
        {municipality.places.length > 0 && (
          <div style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <p style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>
                  Qué visitar
                </p>
                <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "28px", fontWeight: 700, margin: 0 }}>
                  Lugares turísticos
                </h2>
              </div>
              <Link href={`/lugares?municipio=${municipality.slug}`} style={{ color: "#6ee7b7", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                Ver todos →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {municipality.places.map((place) => (
                <Link key={place.id} href={`/lugares/${place.slug}`} style={{
                  position: "relative", overflow: "hidden", borderRadius: "12px",
                  display: "block", aspectRatio: "16/9", textDecoration: "none",
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `url('${placeImages[place.slug] || ""}')`,
                    backgroundSize: "cover", backgroundPosition: "center",
                    backgroundColor: "#1a2e1f",
                  }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px" }}>
                    <div style={{ color: "white", fontWeight: 700, fontSize: "14px", marginBottom: "2px" }}>{place.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>{place.category.icon} {place.category.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Alojamientos */}
        {municipality.accommodations.length > 0 && (
          <div style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <p style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>
                  Dónde quedarse
                </p>
                <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "28px", fontWeight: 700, margin: 0 }}>
                  Alojamientos
                </h2>
              </div>
              <Link href={`/alojamientos?municipio=${municipality.slug}`} style={{ color: "#6ee7b7", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                Ver todos →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              {municipality.accommodations.map((acc) => (
                <Link key={acc.id} href={`/alojamientos/${acc.slug}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#1a1a1a", borderRadius: "12px", padding: "16px 20px",
                  border: "1px solid #2a2a2a", textDecoration: "none",
                }}>
                  <div>
                    <div style={{ color: "white", fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>{acc.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{acc.type}</div>
                  </div>
                  <div style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "14px" }}>
                    Desde ${acc.priceMin.toLocaleString("es-CO")}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Restaurantes */}
        {municipality.restaurants.length > 0 && (
          <div style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <p style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>
                  Dónde comer
                </p>
                <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "28px", fontWeight: 700, margin: 0 }}>
                  Restaurantes
                </h2>
              </div>
              <Link href={`/restaurantes?municipio=${municipality.slug}`} style={{ color: "#6ee7b7", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                Ver todos →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              {municipality.restaurants.map((r) => (
                <Link key={r.id} href={`/restaurantes/${r.slug}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#1a1a1a", borderRadius: "12px", padding: "16px 20px",
                  border: "1px solid #2a2a2a", textDecoration: "none",
                }}>
                  <div>
                    <div style={{ color: "white", fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>{r.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{r.foodType}</div>
                  </div>
                  <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: "14px" }}>
                    ★ {r.rating.toFixed(1)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Volver */}
        <Link href="/municipios" style={{
          display: "inline-block",
          color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: 600,
          textDecoration: "none", padding: "12px 24px",
          background: "#1a1a1a", borderRadius: "12px", border: "1px solid #2a2a2a",
        }}>
          ← Volver a municipios
        </Link>
      </div>
    </div>
  )
}