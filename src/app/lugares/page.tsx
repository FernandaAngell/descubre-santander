import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MapPin, Filter } from "lucide-react"
import { Place, Municipality, Category } from "@prisma/client"

type PlaceWithRelations = Place & {
  municipality: Municipality
  category: Category
}

interface Props {
  searchParams: Promise<{ categoria?: string; municipio?: string; q?: string }>
}

const placeImages: Record<string, string> = {
  "canon-del-chicamocha": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403498/ca%C3%B1on_ejyedw.jpg",
  "barichara-pueblo": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403521/barichara_fu4npr.jpg",
  "cascada-juan-curi": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403539/cascada_juan_curi_lafsmp.jpg",
  "rafting-rio-fonce": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403585/rifting_vg7frt.png",
  "parque-wilches-bucaramanga": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403555/garcia_rovira_obkprb.jpg",
  "mirador-santander-giron": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403572/mirador_x3tndm.jpg",
}

export default async function LugaresPage({ searchParams }: Props) {
  const params = await searchParams
  const { categoria, municipio, q } = params

  const [places, categories, municipalities] = await Promise.all([
    prisma.place.findMany({
      where: {
        status: "PUBLISHED",
        ...(categoria && { category: { slug: categoria } }),
        ...(municipio && { municipality: { slug: municipio } }),
        ...(q && {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }),
      },
      include: { municipality: true, category: true },
      orderBy: { featured: "desc" },
    }),
    prisma.category.findMany(),
    prisma.municipality.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", paddingTop: "80px" }}>

      {/* Header con paddings responsivos */}
      <div 
        className="px-6 pt-12 pb-8 md:pt-[60px] md:pb-[48px]"
        style={{ maxWidth: "1152px", margin: "0 auto" }}
      >
        <p style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>
          Santander, Colombia
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, color: "#ffffff", margin: "0 0 16px", lineHeight: 1 }}>
          Lugares turísticos
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", margin: 0 }}>
          Descubre los destinos más increíbles de Santander
        </p>
      </div>

      {/* Contenedor Principal */}
      <div 
        className="px-6 pb-20 md:pb-[120px]"
        style={{ maxWidth: "1152px", margin: "0 auto" }}
      >
        {/* Layout: Se apila en vertical (flex-col) en móvil y se divide en escritorio (md:flex-row) */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-8 lg:gap-[40px]">

          {/* Sidebar / Panel de Filtros */}
          <aside className="w-full md:w-[220px] md:flex-shrink-0">
            {/* Sticky solo activo a partir de resoluciones de escritorio */}
            <div className="md:sticky md:top-[100px] flex flex-col gap-6 md:gap-8">

              {/* Buscador */}
              <div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
                  Buscar
                </p>
                <form>
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Nombre o descripción..."
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      marginBottom: "8px",
                    }}
                  />
                  {categoria && <input type="hidden" name="categoria" value={categoria} />}
                  {municipio && <input type="hidden" name="municipio" value={municipio} />}
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#15803d",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Buscar
                  </button>
                </form>
              </div>

              {/* Categorías (Responsivo: Desplazamiento horizontal en celulares, lista vertical en web) */}
              <div className="flex flex-col">
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
                  Categoría
                </p>
                <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-none whitespace-nowrap">
                  <Link href="/lugares" style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    textDecoration: "none",
                    background: !categoria ? "#1a2e1f" : "transparent",
                    color: !categoria ? "#6ee7b7" : "rgba(255,255,255,0.5)",
                    border: !categoria ? "1px solid #2a4a2e" : "1px solid transparent",
                    flexShrink: 0,
                  }}>
                    Todas
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/lugares?categoria=${cat.slug}`}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 500,
                        textDecoration: "none",
                        background: categoria === cat.slug ? "#1a2e1f" : "transparent",
                        color: categoria === cat.slug ? "#6ee7b7" : "rgba(255,255,255,0.5)",
                        border: categoria === cat.slug ? "1px solid #2a4a2e" : "1px solid transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexShrink: 0,
                      }}
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Municipios (Responsivo: Desplazamiento horizontal en celulares, lista vertical en web) */}
              <div className="flex flex-col">
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
                  Municipio
                </p>
                <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-none whitespace-nowrap">
                  <Link href={categoria ? `/lugares?categoria=${categoria}` : "/lugares"} style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    textDecoration: "none",
                    background: !municipio ? "#1a2e1f" : "transparent",
                    color: !municipio ? "#6ee7b7" : "rgba(255,255,255,0.5)",
                    border: !municipio ? "1px solid #2a4a2e" : "1px solid transparent",
                    flexShrink: 0,
                  }}>
                    Todos
                  </Link>
                  {municipalities.map((mun) => (
                    <Link
                      key={mun.id}
                      href={`/lugares?municipio=${mun.slug}${categoria ? `&categoria=${categoria}` : ""}`}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 500,
                        textDecoration: "none",
                        background: municipio === mun.slug ? "#1a2e1f" : "transparent",
                        color: municipio === mun.slug ? "#6ee7b7" : "rgba(255,255,255,0.5)",
                        border: municipio === mun.slug ? "1px solid #2a4a2e" : "1px solid transparent",
                        flexShrink: 0,
                      }}
                    >
                      {mun.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de Destinos */}
          <div style={{ flex: 1 }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginBottom: "24px" }}>
              <span style={{ color: "white", fontWeight: 600 }}>{places.length}</span> lugares encontrados
            </p>

            {places.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                <h3 style={{ color: "white", fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
                  No encontramos resultados
                </h3>
                <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>
                  Intenta con otros filtros
                </p>
                <Link href="/lugares" style={{
                  background: "#15803d",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                }}>
                  Ver todos
                </Link>
              </div>
            ) : (
              /* Grid Adaptable: 1 columna en móvil, 2 en tablets (sm) y 3 en ordenadores (lg) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {places.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaceCard({ place }: { place: PlaceWithRelations }) {
  const placeImages: Record<string, string> = {
    "canon-del-chicamocha": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403498/ca%C3%B1on_ejyedw.jpg",
    "barichara-pueblo": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403521/barichara_fu4npr.jpg",
    "cascada-juan-curi": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403539/cascada_juan_curi_lafsmp.jpg",
    "rafting-rio-fonce": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403585/rifting_vg7frt.png",
    "parque-wilches-bucaramanga": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403555/garcia_rovira_obkprb.jpg",
    "mirador-santander-giron": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403572/mirador_x3tndm.jpg",
  }

  const difficultyLabel: Record<string, string> = {
    EASY: "Fácil",
    MODERATE: "Moderado",
    HARD: "Difícil",
  }

  const difficultyColor: Record<string, string> = {
    EASY: "#6ee7b7",
    MODERATE: "#fbbf24",
    HARD: "#f87171",
  }

  return (
    <Link
      href={`/lugares/${place.slug}`}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        display: "block",
        aspectRatio: "3/4",
        textDecoration: "none",
      }}
    >
      {/* Imagen */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url('${placeImages[place.slug] || "https://res.cloudinary.com/dxalbznya/image/upload/v1782403498/ca%C3%B1on_ejyedw.jpg"}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />

      {/* Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
      }} />

      {/* Badge categoría */}
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
          {place.category.icon} {place.category.name}
        </span>
      </div>

      {/* Featured badge */}
      {place.featured && (
        <div style={{ position: "absolute", top: "12px", right: "12px" }}>
          <span style={{
            background: "#6ee7b7",
            color: "#0a0a0a",
            fontSize: "10px",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "20px",
          }}>
            Destacado
          </span>
        </div>
      )}

      {/* Info */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px" }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "17px",
          fontWeight: 700,
          color: "white",
          margin: "0 0 6px",
          lineHeight: 1.3,
        }}>
          {place.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.55)", fontSize: "12px", marginBottom: "10px" }}>
          <MapPin size={12} />
          <span>{place.municipality.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {place.difficulty && (
            <span style={{ fontSize: "11px", fontWeight: 600, color: difficultyColor[place.difficulty] }}>
              {difficultyLabel[place.difficulty]}
            </span>
          )}
          {place.entryFee !== null && (
            <span style={{ fontSize: "12px", fontWeight: 700, color: "white" }}>
              {place.entryFee === 0 ? "Gratis" : `$${place.entryFee.toLocaleString("es-CO")}`}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}