import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { MapPin, Lightbulb, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import FavoriteButton from "@/components/FavoriteButton"
import ReviewForm from "@/components/ReviewForm"

interface Props {
  params: Promise<{ slug: string }>
}

const placeImages: Record<string, string> = {
  "canon-del-chicamocha": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403498/ca%C3%B1on_ejyedw.jpg",
  "barichara-pueblo": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403521/barichara_fu4npr.jpg",
  "cascada-juan-curi": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403539/cascada_juan_curi_lafsmp.jpg",
  "rafting-rio-fonce": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403585/rifting_vg7frt.png",
  "parque-wilches-bucaramanga": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403555/garcia_rovira_obkprb.jpg",
  "mirador-santander-giron": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403572/mirador_x3tndm.jpg",
}

export default async function LugarDetailPage({ params }: Props) {
  const { slug } = await params

  const place = await prisma.place.findUnique({
    where: { slug },
    include: {
      municipality: true,
      category: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!place || place.status !== "PUBLISHED") notFound()

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

  const heroImage = placeImages[place.slug] || "https://res.cloudinary.com/dxalbznya/image/upload/v1782403498/ca%C3%B1on_ejyedw.jpg"

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ position: "relative", height: "70vh", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, #0a0a0a 100%)",
        }} />

        {/* Contenido hero */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 48px", maxWidth: "1152px", margin: "0 auto" }}>
          <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "0.5px solid rgba(255,255,255,0.25)",
                color: "white",
                fontSize: "12px",
                fontWeight: 600,
                padding: "5px 12px",
                borderRadius: "20px",
              }}>
                {place.category.icon} {place.category.name}
              </span>
              {place.featured && (
                <span style={{
                  background: "#6ee7b7",
                  color: "#0a0a0a",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "5px 12px",
                  borderRadius: "20px",
                }}>
                  Destacado
                </span>
              )}
              <FavoriteButton placeId={place.id} />
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 700,
              color: "white",
              margin: "0 0 12px",
              lineHeight: 1,
            }}>
              {place.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.55)", fontSize: "14px" }}>
              <MapPin size={14} />
              <Link href={`/municipios/${place.municipality.slug}`} style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
                {place.municipality.name}, Santander
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 24px 120px" }}>
        <div style={{ display: "flex", gap: "48px" }}>

          {/* Principal */}
          <div style={{ flex: 1 }}>

            {/* Info rápida */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "40px" }}>
              {place.difficulty && (
                <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "16px", border: "1px solid #2a2a2a" }}>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "6px" }}>Dificultad</div>
                  <div style={{ color: difficultyColor[place.difficulty], fontWeight: 700, fontSize: "14px" }}>
                    {difficultyLabel[place.difficulty]}
                  </div>
                </div>
              )}
              {place.entryFee !== null && (
                <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "16px", border: "1px solid #2a2a2a" }}>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "6px" }}>Entrada</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>
                    {place.entryFee === 0 ? "Gratis" : `$${place.entryFee.toLocaleString("es-CO")}`}
                  </div>
                </div>
              )}
              {place.bestTime && (
                <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "16px", border: "1px solid #2a2a2a" }}>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "6px" }}>Mejor época</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "13px" }}>{place.bestTime}</div>
                </div>
              )}
              {place.address && (
                <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "16px", border: "1px solid #2a2a2a" }}>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "6px" }}>Dirección</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "12px", lineHeight: 1.4 }}>{place.address}</div>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "28px", border: "1px solid #2a2a2a", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>
                Sobre este lugar
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>
                {place.description}
              </p>
            </div>

            {/* Tips */}
            {place.tips && place.tips.length > 0 && (
              <div style={{ background: "#0f2318", borderRadius: "16px", padding: "28px", border: "1px solid #1a3d2b", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <Lightbulb size={18} color="#6ee7b7" />
                  <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "20px", fontWeight: 700, margin: 0 }}>
                    Consejos útiles
                  </h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {place.tips.map((tip, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <span style={{
                        width: "24px", height: "24px",
                        background: "#6ee7b7",
                        color: "#0a0a0a",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: 700,
                        flexShrink: 0, marginTop: "1px",
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.6 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reseñas */}
            <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "28px", border: "1px solid #2a2a2a" }}>
              <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>
                Reseñas {place.reviews.length > 0 && `(${place.reviews.length})`}
              </h2>
              {place.reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.3)" }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>💬</div>
                  <p style={{ margin: 0 }}>Aún no hay reseñas. ¡Sé el primero!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  {place.reviews.map((review) => (
                    <div key={review.id} style={{ borderBottom: "1px solid #2a2a2a", paddingBottom: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <div style={{
                          width: "32px", height: "32px",
                          background: "#1a2e1f",
                          borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#6ee7b7", fontWeight: 700, fontSize: "13px",
                        }}>
                          {review.user.name?.[0] ?? "U"}
                        </div>
                        <div>
                          <div style={{ color: "white", fontSize: "13px", fontWeight: 600 }}>{review.user.name}</div>
                          <div style={{ color: "#fbbf24", fontSize: "12px" }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                        </div>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
              <ReviewForm placeId={place.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ width: "300px", flexShrink: 0 }}>

            {/* Mapa */}
            <div style={{ background: "#1a1a1a", borderRadius: "16px", overflow: "hidden", border: "1px solid #2a2a2a", marginBottom: "16px" }}>
              <div style={{
                height: "200px",
                background: "#0f2318",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: "8px",
              }}>
                <MapPin size={32} color="#6ee7b7" />
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>Mapa próximamente</p>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", margin: 0 }}>
                  {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </p>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>
                  {place.address || place.municipality.name}
                </p>
              </div>
            </div>

            {/* Municipio */}
            <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "20px", border: "1px solid #2a2a2a", marginBottom: "16px" }}>
              <h3 style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>
                Municipio
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{
                  width: "40px", height: "40px",
                  background: "#0f2318",
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <MapPin size={18} color="#6ee7b7" />
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "15px" }}>{place.municipality.name}</div>
                  {place.municipality.weather && (
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{place.municipality.weather}</div>
                  )}
                </div>
              </div>
              {place.municipality.description && (
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: 1.6, margin: "0 0 16px" }}>
                  {place.municipality.description.substring(0, 120)}...
                </p>
              )}
              <Link href={`/municipios/${place.municipality.slug}`} style={{
                display: "block",
                textAlign: "center",
                color: "#6ee7b7",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                padding: "10px",
                background: "#0f2318",
                borderRadius: "10px",
                border: "1px solid #1a3d2b",
              }}>
                Ver más de {place.municipality.name} →
              </Link>
            </div>

            {/* Volver */}
            <Link href="/lugares" style={{
              display: "block",
              textAlign: "center",
              color: "rgba(255,255,255,0.4)",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              padding: "12px",
              background: "#1a1a1a",
              borderRadius: "12px",
              border: "1px solid #2a2a2a",
            }}>
              ← Volver a lugares
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}