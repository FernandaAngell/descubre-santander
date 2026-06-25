"use client"

import Link from "next/link"
import { MapPin, Clock } from "lucide-react"
import { Place, Municipality, Category } from "@prisma/client"

type PlaceWithRelations = Place & {
  municipality: Municipality
  category: Category
}

interface Props {
  places: PlaceWithRelations[]
}

const placeImages: Record<string, string> = {
  "canon-del-chicamocha": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403498/ca%C3%B1on_ejyedw.jpg",
  "barichara-pueblo": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403521/barichara_fu4npr.jpg",
  "cascada-juan-curi": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403539/cascada_juan_curi_lafsmp.jpg",
  "rafting-rio-fonce": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403585/rifting_vg7frt.png",
  "parque-wilches-bucaramanga": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403555/garcia_rovira_obkprb.jpg",
  "mirador-santander-giron": "https://res.cloudinary.com/dxalbznya/image/upload/v1782403572/mirador_x3tndm.jpg",
}

export default function FeaturedPlaces({ places }: Props) {
  return (
    <section style={{ backgroundColor: "#0a0a0a", padding: "60px 24px 120px" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <p style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "10px" }}>
              Destinos imperdibles
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#ffffff", margin: 0 }}>
              Lugares destacados
            </h2>
          </div>
          <Link href="/lugares" style={{ fontSize: "14px", fontWeight: 600, color: "#6ee7b7", textDecoration: "none" }}>
            Ver todos →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {places.map((place) => (
            <Link
              key={place.id}
              href={`/lugares/${place.slug}`}
              style={{ position: "relative", overflow: "hidden", borderRadius: "16px", display: "block", aspectRatio: "4/3", textDecoration: "none" }}
            >
              <div
                style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url('${placeImages[place.slug] || "https://res.cloudinary.com/dxalbznya/image/upload/v1782403498/ca%C3%B1on_ejyedw.jpg"}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "transform 0.7s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />
              <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                <span style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "0.5px solid rgba(255,255,255,0.25)", color: "white", fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px" }}>
                  {place.category.icon} {place.category.name}
                </span>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "white", margin: "0 0 4px", lineHeight: 1.3 }}>
                  {place.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.6)", fontSize: "12px", marginBottom: "4px" }}>
                  <MapPin size={12} />
                  <span>{place.municipality.name}</span>
                </div>
                {place.bestTime && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.45)", fontSize: "11px" }}>
                    <Clock size={11} />
                    <span>Mejor época: {place.bestTime}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}