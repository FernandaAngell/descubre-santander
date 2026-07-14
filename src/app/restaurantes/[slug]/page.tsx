import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { MapPin, Star, Clock, Phone } from "lucide-react"
import Link from "next/link"
import ReviewForm from "@/components/ReviewForm"

interface Props {
  params: Promise<{ slug: string }>
}

const restaurantImages: Record<string, string> = {
  "restaurante-barichara-plaza": "https://res.cloudinary.com/dxalbznya/image/upload/v1782422294/casona_e178vc.png",
  "restaurante-leal-bucaramanga": "https://res.cloudinary.com/dxalbznya/image/upload/v1782422310/El_Viejo_Chiflas_Restaurante_Bucaramanga_Santander_4_94e75935ab_nqva1p.jpg",
  "restaurante-san-gil-aventura": "https://res.cloudinary.com/dxalbznya/image/upload/v1782422328/gringo-mike-s_cfyrxu.jpg",
}

export default async function RestauranteDetailPage({ params }: Props) {
  const { slug } = await params

  const restaurant = await prisma.restaurant.findUnique({
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

  if (!restaurant || restaurant.status !== "PUBLISHED") notFound()

  const heroImage = restaurantImages[restaurant.slug] || ""

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ position: "relative", height: "70vh", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: heroImage ? `url('${heroImage}')` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#1a1a1a",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, #0a0a0a 100%)",
        }} />

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 48px" }}>
          <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span style={{
                background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                border: "0.5px solid rgba(255,255,255,0.25)",
                color: "white", fontSize: "12px", fontWeight: 600,
                padding: "5px 12px", borderRadius: "20px",
              }}>
                {restaurant.foodType}
              </span>
              {restaurant.rating > 0 && (
                <span style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  background: "rgba(251,191,36,0.15)", backdropFilter: "blur(8px)",
                  border: "0.5px solid rgba(251,191,36,0.3)",
                  color: "#fbbf24", fontSize: "12px", fontWeight: 700,
                  padding: "5px 12px", borderRadius: "20px",
                }}>
                  <Star size={12} fill="#fbbf24" />
                  {restaurant.rating.toFixed(1)}
                </span>
              )}
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 700, color: "white",
              margin: "0 0 12px", lineHeight: 1,
            }}>
              {restaurant.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.55)", fontSize: "14px" }}>
              <MapPin size={14} />
              <span>{restaurant.municipality.name}, Santander</span>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "32px" }}>
              <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "16px", border: "1px solid #2a2a2a" }}>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "6px" }}>Precio promedio</div>
                <div style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>
                  ${restaurant.priceAvg.toLocaleString("es-CO")} por persona
                </div>
              </div>
              {restaurant.schedule && (
                <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "16px", border: "1px solid #2a2a2a" }}>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "6px" }}>Horario</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "12px", lineHeight: 1.4 }}>{restaurant.schedule}</div>
                </div>
              )}
              {restaurant.address && (
                <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "16px", border: "1px solid #2a2a2a" }}>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "6px" }}>Dirección</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "12px", lineHeight: 1.4 }}>{restaurant.address}</div>
                </div>
              )}
            </div>

            {/* Descripción */}
            {restaurant.description && (
              <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "28px", border: "1px solid #2a2a2a", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>
                  Sobre este restaurante
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>
                  {restaurant.description}
                </p>
              </div>
            )}

            {/* Especialidades */}
            {restaurant.specialties.length > 0 && (
              <div style={{ background: "#0f2318", borderRadius: "16px", padding: "28px", border: "1px solid #1a3d2b", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>
                  Especialidades
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {restaurant.specialties.map((s, i) => (
                    <span key={i} style={{
                      background: "#1a2e1f",
                      border: "1px solid #2a4a2e",
                      color: "#6ee7b7",
                      fontSize: "13px", fontWeight: 500,
                      padding: "8px 16px", borderRadius: "20px",
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reseñas */}
            <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "28px", border: "1px solid #2a2a2a" }}>
              <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>
                Reseñas {restaurant.reviews.length > 0 && `(${restaurant.reviews.length})`}
              </h2>
              {restaurant.reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.3)" }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>💬</div>
                  <p style={{ margin: 0 }}>Aún no hay reseñas. ¡Sé el primero!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  {restaurant.reviews.map((review) => (
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
              <ReviewForm restaurantId={restaurant.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ width: "300px", flexShrink: 0 }}>

            {/* Contacto */}
            <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "24px", border: "1px solid #2a2a2a", marginBottom: "16px" }}>
              <h3 style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>
                Contacto
              </h3>
              {restaurant.phone && (
                <a href={`tel:${restaurant.phone}`} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  background: "#15803d", color: "white", fontWeight: 600,
                  padding: "13px 16px", borderRadius: "12px", textDecoration: "none",
                  fontSize: "14px", marginBottom: "10px",
                }}>
                  <Phone size={16} />
                  {restaurant.phone}
                </a>
              )}
              {restaurant.schedule && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "12px" }}>
                  <Clock size={14} color="rgba(255,255,255,0.3)" style={{ marginTop: "1px", flexShrink: 0 }} />
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: 1.5 }}>{restaurant.schedule}</span>
                </div>
              )}
              {restaurant.address && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "12px" }}>
                  <MapPin size={14} color="rgba(255,255,255,0.3)" style={{ marginTop: "1px", flexShrink: 0 }} />
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: 1.5 }}>{restaurant.address}</span>
                </div>
              )}
            </div>

            {/* Municipio */}
            <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "20px", border: "1px solid #2a2a2a", marginBottom: "16px" }}>
              <h3 style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>
                Municipio
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px", height: "40px", background: "#0f2318",
                  borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <MapPin size={18} color="#6ee7b7" />
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "15px" }}>{restaurant.municipality.name}</div>
                  {restaurant.municipality.weather && (
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{restaurant.municipality.weather}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Volver */}
            <Link href="/restaurantes" style={{
              display: "block", textAlign: "center",
              color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: 600,
              textDecoration: "none", padding: "12px",
              background: "#1a1a1a", borderRadius: "12px", border: "1px solid #2a2a2a",
            }}>
              ← Volver a restaurantes
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}