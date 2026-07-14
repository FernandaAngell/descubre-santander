import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Mountain, Thermometer } from "lucide-react"

const municipioImages: Record<string, string> = {
  "bucaramanga": "https://res.cloudinary.com/dxalbznya/image/upload/v1782423085/bucaramanga_knvql7.avif",
  "floridablanca": "https://res.cloudinary.com/dxalbznya/image/upload/v1782423044/floridabalnca_gumvyl.jpg",
  "giron": "https://res.cloudinary.com/dxalbznya/image/upload/v1782423024/giron_z3zo9z.jpg",
  "barichara": "https://res.cloudinary.com/dxalbznya/image/upload/v1782423109/barichara_nvnfci.webp",
  "san-gil": "https://res.cloudinary.com/dxalbznya/image/upload/v1782422989/san_gil_sfdnfx.jpg",
  "curiti": "https://res.cloudinary.com/dxalbznya/image/upload/v1782423067/curiti_y1qlxd.jpg",
}

export default async function MunicipiosPage() {
  const municipalities = await prisma.municipality.findMany({
    include: {
      _count: {
        select: {
          places: true,
          accommodations: true,
          restaurants: true,
        },
      },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", paddingTop: "80px" }}>

      {/* Header con padding responsivo */}
      <div 
        className="px-6 pt-12 pb-8 md:pt-[60px] md:pb-[48px]"
        style={{ maxWidth: "1152px", margin: "0 auto" }}
      >
        <p style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>
          Santander, Colombia
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, color: "#ffffff", margin: "0 0 16px", lineHeight: 1 }}>
          Municipios
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", margin: 0 }}>
          Explora los {municipalities.length} municipios de Santander
        </p>
      </div>

      {/* Contenedor de contenido con padding responsivo */}
      <div 
        className="px-6 pb-20 md:pb-[120px]"
        style={{ maxWidth: "1152px", margin: "0 auto" }}
      >
        {/* Grid Adaptable: 1 columna en móvil, 2 en tablets (sm) y 3 en ordenadores (lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {municipalities.map((mun) => (
            <Link
              key={mun.id}
              href={`/municipios/${mun.slug}`}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "16px",
                display: "block",
                textDecoration: "none",
                aspectRatio: "4/3",
              }}
            >
              {/* Imagen */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `url('${municipioImages[mun.slug] || ""}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#1a2e1f",
                transition: "transform 0.7s ease",
              }} />

              {/* Overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
              }} />

              {/* Badge */}
              <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                <span style={{
                  background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                  border: "0.5px solid rgba(255,255,255,0.25)",
                  color: "white", fontSize: "11px", fontWeight: 600,
                  padding: "4px 10px", borderRadius: "20px",
                }}>
                  {mun.department}
                </span>
              </div>

              {/* Info */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px" }}>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px", fontWeight: 700,
                  color: "white", margin: "0 0 6px",
                }}>
                  {mun.name}
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  {mun.altitude && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>
                      <Mountain size={11} />
                      <span>{mun.altitude}m</span>
                    </div>
                  )}
                  {mun.weather && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>
                      <Thermometer size={11} />
                      <span>{mun.weather}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "16px" }}>{mun._count.places}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Lugares</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "16px" }}>{mun._count.accommodations}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Alojamientos</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "16px" }}>{mun._count.restaurants}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Restaurantes</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}