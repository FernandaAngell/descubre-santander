"use client"

import Link from "next/link"
import { Category } from "@prisma/client"

interface Props {
  categories: Category[]
}

export default function CategoriesSection({ categories }: Props) {
  return (
    <section style={{ backgroundColor: "#0a0a0a", padding: "0 24px 80px" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>
            Explora por categoría
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#ffffff", margin: 0 }}>
            ¿Qué quieres vivir?
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px" }}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/lugares?categoria=${category.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                background: "#1a1a1a",
                borderRadius: "16px",
                padding: "28px 12px",
                border: "1px solid #2a2a2a",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6ee7b7"
                e.currentTarget.style.background = "#1a2e1f"
                e.currentTarget.style.transform = "translateY(-4px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a2a2a"
                e.currentTarget.style.background = "#1a1a1a"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <span style={{ fontSize: "36px", lineHeight: 1 }}>{category.icon}</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#9ca3af", textAlign: "center" }}>
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}