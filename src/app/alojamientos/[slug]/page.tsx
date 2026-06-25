import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { MapPin, Phone, ExternalLink, Users, Clock } from "lucide-react"
import Link from "next/link"
import ReviewForm from "@/components/ReviewForm"

interface Props {
  params: Promise<{ slug: string }>
}

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

export default async function AlojamientoDetailPage({ params }: Props) {
  const { slug } = await params

  const accommodation = await prisma.accommodation.findUnique({
    where: { slug },
    include: {
      municipality: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!accommodation || accommodation.status !== "PUBLISHED") notFound()

  const heroImage = accommodationImages[accommodation.slug] || ""

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
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "0.5px solid rgba(255,255,255,0.25)",
                color: "white", fontSize: "12px", fontWeight: 600,
                padding: "5px 12px", borderRadius: "20px",
              }}>
                {tipoLabels[accommodation.type]}
              </span>
              <span style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "0.5px solid rgba(255,255,255,0.25)",
                color: "white", fontSize: "12px", fontWeight: 600,
                padding: "5px 12px", borderRadius: "20px",
              }}>
                Ideal para {idealForLabels[accommodation.idealFor]}
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 700, color: "white",
              margin: "0 0 12px", lineHeight: 1,
            }}>
              {accommodation.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.55)", fontSize: "14px" }}>
              <MapPin size={14} />
              <span>{accommodation.municipality.name}, Santander</span>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
              <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "16px", border: "1px solid #2a2a2a" }}>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "6px" }}>Precio/noche</div>
                <div style={{ color: "white", fontWeight: 700, fontSize: "13px" }}>
                  ${accommodation.priceMin.toLocaleString("es-CO")} — ${accommodation.priceMax.toLocaleString("es-CO")}
                </div>
              </div>
              {accommodation.capacity && (
                <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "16px", border: "1px solid #2a2a2a" }}>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "6px" }}>Capacidad</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>Hasta {accommodation.capacity} personas</div>
                </div>
              )}
              {accommodation.checkIn && (
                <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "16px", border: "1px solid #2a2a2a" }}>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "6px" }}>Check-in</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>{accommodation.checkIn}</div>
                </div>
              )}
              {accommodation.checkOut && (
                <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "16px", border: "1px solid #2a2a2a" }}>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "6px" }}>Check-out</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>{accommodation.checkOut}</div>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "28px", border: "1px solid #2a2a2a", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>
                Sobre este alojamiento
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>
                {accommodation.description}
              </p>
            </div>

            {/* Amenidades */}
            {accommodation.amenities.length > 0 && (
              <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "28px", border: "1px solid #2a2a2a", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>
                  Servicios incluidos
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                  {accommodation.amenities.map((amenity, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        width: "20px", height: "20px",
                        background: "#0f2318",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#6ee7b7", fontSize: "11px", fontWeight: 700, flexShrink: 0,
                      }}>✓</span>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reseñas */}
            <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "28px", border: "1px solid #2a2a2a" }}>
              <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>
                Reseñas {accommodation.reviews.length > 0 && `(${accommodation.reviews.length})`}
              </h2>
              {accommodation.reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.3)" }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>💬</div>
                  <p style={{ margin: 0 }}>Aún no hay reseñas. ¡Sé el primero!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  {accommodation.reviews.map((review) => (
                    <div key={review.id} style={{ borderBottom: "1px solid #2a2a2a", paddingBottom: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <div style={{
                          width: "32px", height: "32px", background: "#1a2e1f",
                          borderRadius: "50%", display: "flex", alignItems: "center",
                          justifyContent: "center", color: "#6ee7b7", fontWeight: 700, fontSize: "13px",
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
              <ReviewForm accommodationId={accommodation.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ width: "300px", flexShrink: 0 }}>

            {/* Reservar */}
            <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "24px", border: "1px solid #2a2a2a", marginBottom: "16px" }}>
              <div style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
                Precio por noche
              </div>
              <div style={{ color: "white", fontSize: "28px", fontWeight: 700, marginBottom: "4px" }}>
                Desde ${accommodation.priceMin.toLocaleString("es-CO")}
              </div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginBottom: "20px" }}>
                hasta ${accommodation.priceMax.toLocaleString("es-CO")}
              </div>

              {accommodation.contactUrl && (
                <a href={accommodation.contactUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  background: "#15803d", color: "white", fontWeight: 600,
                  padding: "13px", borderRadius: "12px", textDecoration: "none",
                  fontSize: "14px", marginBottom: "10px", transition: "background 0.2s",
                }}>
                  <ExternalLink size={16} />
                  Contactar / Reservar
                </a>
              )}

              {accommodation.phone && (
                <a href={`tel:${accommodation.phone}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  background: "#1a1a1a", color: "rgba(255,255,255,0.6)",
                  border: "1px solid #2a2a2a", fontWeight: 600,
                  padding: "13px", borderRadius: "12px", textDecoration: "none",
                  fontSize: "14px", transition: "all 0.2s",
                }}>
                  <Phone size={16} />
                  {accommodation.phone}
                </a>
              )}
            </div>

            {/* Ubicación */}
            <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "20px", border: "1px solid #2a2a2a", marginBottom: "16px" }}>
              <h3 style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>
                Ubicación
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{
                  width: "40px", height: "40px", background: "#0f2318",
                  borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <MapPin size={18} color="#6ee7b7" />
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "15px" }}>{accommodation.municipality.name}</div>
                  {accommodation.municipality.weather && (
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{accommodation.municipality.weather}</div>
                  )}
                </div>
              </div>
              {accommodation.address && (
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>{accommodation.address}</p>
              )}
            </div>

            {/* Volver */}
            <Link href="/alojamientos" style={{
              display: "block", textAlign: "center",
              color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: 600,
              textDecoration: "none", padding: "12px",
              background: "#1a1a1a", borderRadius: "12px", border: "1px solid #2a2a2a",
            }}>
              ← Volver a alojamientos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}