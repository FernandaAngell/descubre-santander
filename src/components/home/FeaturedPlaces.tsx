"use client"

import Link from "next/link"
import { MapPin, Calendar, ArrowRight, Leaf, Mountain, Landmark, Camera, Waves, Home } from "lucide-react"
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

const categoryIcons: Record<string, React.ReactNode> = {
  "naturaleza": <Leaf size={13} />,
  "aventura": <Mountain size={13} />,
  "cultural": <Landmark size={13} />,
  "mirador": <Camera size={13} />,
  "cascada": <Waves size={13} />,
  "pueblo": <Home size={13} />,
}

export default function FeaturedPlaces({ places }: Props) {
  return (
    <section style={{ backgroundColor: "#0a0a0a", padding: "0 24px 120px" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <p style={{ color: "#4ade80", fontSize: "12px", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", marginBottom: "12px" }}>
              Para empezar tu viaje
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 600, color: "#f5f0e8", margin: 0, lineHeight: 1.1 }}>
              Destinos destacados
            </h2>
          </div>
          <Link href="/lugares" style={{
            display: "flex", alignItems: "center", gap: "8px",
            fontSize: "15px", fontWeight: 500, color: "#4ade80", textDecoration: "none",
          }}>
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {places.map((place) => (
            <Link
              key={place.id}
              href={`/lugares/${place.slug}`}
              style={{
                display: "block",
                borderRadius: "14px",
                overflow: "hidden",
                textDecoration: "none",
                background: "#111311",
                border: "1px solid #1f2a24",
              }}
            >
              {/* Imagen con badge */}
              <div style={{ position: "relative", aspectRatio: "1.25", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url('${placeImages[place.slug] || ""}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "#0f1a14",
                }} />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(17,19,17,0.9) 0%, transparent 30%)",
                }} />
                {/* Badge sobre la foto abajo */}
                <div style={{ position: "absolute", bottom: "14px", left: "16px" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "7px",
                    background: "rgba(10,15,12,0.75)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(74,222,128,0.45)",
                    color: "#4ade80", fontSize: "13px", fontWeight: 500,
                    padding: "6px 15px", borderRadius: "20px",
                  }}>
                    {categoryIcons[place.category.slug] || <Leaf size={13} />}
                    {place.category.name}
                  </span>
                </div>
              </div>

              {/* Texto debajo */}
              <div style={{ padding: "16px 20px 20px" }}>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px", fontWeight: 600,
                  color: "#f5f0e8", margin: "0 0 10px", lineHeight: 1.15,
                }}>
                  {place.name}
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "rgba(255,255,255,0.65)", fontSize: "14px", marginBottom: "7px" }}>
                  <MapPin size={14} />
                  <span>{place.municipality.name}</span>
                </div>

                {place.bestTime && (
                  <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "14px" }}>
                    <Calendar size={14} color="rgba(255,255,255,0.45)" />
                    <span style={{ color: "rgba(255,255,255,0.45)" }}>Mejor época:</span>
                    <span style={{ color: "#4ade80", fontWeight: 500 }}>{place.bestTime}</span>
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