"use client"

import Link from "next/link"
import { Category } from "@prisma/client"
import { Leaf, Mountain, Landmark, Camera, Waves, Home } from "lucide-react"

interface Props {
  categories: Category[]
}

const categoryIcons: Record<string, React.ReactNode> = {
  "naturaleza": <Leaf size={16} />,
  "aventura": <Mountain size={16} />,
  "cultural": <Landmark size={16} />,
  "mirador": <Camera size={16} />,
  "cascada": <Waves size={16} />,
  "pueblo": <Home size={16} />,
}

export default function CategoriesSection({ categories }: Props) {
  return (
    <section style={{ backgroundColor: "#0a0a0a", padding: "48px 24px 64px" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto" }}>

        <div style={{ marginBottom: "36px" }}>
          <p style={{ color: "#4ade80", fontSize: "12px", fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px" }}>
            Explora Santander
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 600, color: "#f5f0e8", margin: "0 0 16px", lineHeight: 1.1 }}>
            Elige cómo quieres vivirlo
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", lineHeight: 1.6, margin: 0, maxWidth: "520px" }}>
            Montañas majestuosas, pueblos con historia y experiencias únicas.
            <br />
            Descubre un destino que lo tiene todo.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/lugares?categoria=${category.slug}`}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid #2a3a30",
                borderRadius: "14px",
                padding: "14px 26px",
                textDecoration: "none",
                color: "#e8e4dc",
                fontSize: "15px", fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4ade80"
                e.currentTarget.style.background = "rgba(74,222,128,0.06)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a3a30"
                e.currentTarget.style.background = "rgba(255,255,255,0.02)"
              }}
            >
              <span style={{ color: "#4ade80", display: "flex", alignItems: "center" }}>
                {categoryIcons[category.slug] || <Leaf size={16} />}
              </span>
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}