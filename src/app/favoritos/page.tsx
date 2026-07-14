import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MapPin, Heart } from "lucide-react"

const placeImages: Record<string, string> = {
  "canon-del-chicamocha": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403498/ca%C3%B1on_ejyedw.jpg",
  "barichara-pueblo": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403521/barichara_fu4npr.jpg",
  "cascada-juan-curi": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403539/cascada_juan_curi_lafsmp.jpg",
  "rafting-rio-fonce": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403585/rifting_vg7frt.png",
  "parque-wilches-bucaramanga": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403555/garcia_rovira_obkprb.jpg",
  "mirador-santander-giron": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403572/mirador_x3tndm.jpg",
}

export default async function FavoritosPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login")

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      place: {
        include: { municipality: true, category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", paddingTop: "80px" }}>

      {/* Header con padding responsivo */}
      <div 
        className="px-6 pt-12 pb-8 md:pt-[60px] md:pb-[48px]"
        style={{ maxWidth: "1152px", margin: "0 auto" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <Heart size={24} color="#f87171" fill="#f87171" />
          <p style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", margin: 0 }}>
            Mi colección
          </p>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, color: "#ffffff", margin: "0 0 12px", lineHeight: 1 }}>
          Mis favoritos
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", margin: 0 }}>
          {favorites.length} {favorites.length === 1 ? "lugar guardado" : "lugares guardados"}
        </p>
      </div>

      {/* Contenedor de contenido con padding responsivo */}
      <div 
        className="px-6 pb-20 md:pb-[120px]"
        style={{ maxWidth: "1152px", margin: "0 auto" }}
      >
        {favorites.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Heart size={64} color="rgba(255,255,255,0.1)" style={{ marginBottom: "24px" }} />
            <h3 style={{ color: "white", fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>
              Aún no tienes favoritos
            </h3>
            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "32px", fontSize: "15px" }}>
              Explora los lugares y guarda los que más te gusten
            </p>
            <Link href="/lugares" style={{
              background: "#15803d", color: "white",
              padding: "14px 32px", borderRadius: "12px",
              textDecoration: "none", fontWeight: 600, fontSize: "15px",
            }}>
              Explorar lugares
            </Link>
          </div>
        ) : (
          /* Grid Adaptable: 1 columna en móvil, 2 en tablets (sm) y 3 en ordenadores (lg) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((fav) => (
              <Link
                key={fav.id}
                href={`/lugares/${fav.place.slug}`}
                style={{
                  position: "relative", overflow: "hidden",
                  borderRadius: "16px", display: "block",
                  aspectRatio: "3/4", textDecoration: "none",
                }}
              >
                {/* Imagen */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url('${placeImages[fav.place.slug] || ""}')`,
                  backgroundSize: "cover", backgroundPosition: "center",
                  backgroundColor: "#1a2e1f",
                  transition: "transform 0.7s ease",
                }} />

                {/* Overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                }} />

                {/* Corazón */}
                <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                  <div style={{
                    width: "32px", height: "32px",
                    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Heart size={14} color="#f87171" fill="#f87171" />
                  </div>
                </div>

                {/* Badge categoría */}
                <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                  <span style={{
                    background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                    border: "0.5px solid rgba(255,255,255,0.25)",
                    color: "white", fontSize: "11px", fontWeight: 600,
                    padding: "4px 10px", borderRadius: "20px",
                  }}>
                    {fav.place.category.icon} {fav.place.category.name}
                  </span>
                </div>

                {/* Info */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px" }}>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px", fontWeight: 700,
                    color: "white", margin: "0 0 6px", lineHeight: 1.3,
                  }}>
                    {fav.place.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                    <MapPin size={12} />
                    <span>{fav.place.municipality.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}