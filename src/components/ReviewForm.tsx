"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"

interface Props {
  placeId?: string
  accommodationId?: string
  restaurantId?: string
}

export default function ReviewForm({ placeId, accommodationId, restaurantId }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!session) {
    return (
      <div style={{ background: "#0f2318", borderRadius: "12px", padding: "24px", textAlign: "center", border: "1px solid #1a3d2b" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "16px", fontSize: "14px" }}>
          Inicia sesión para dejar una reseña
        </p>
        <a href="/auth/login" style={{
          background: "#15803d",
          color: "white",
          padding: "10px 24px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "14px",
        }}>
          Iniciar sesión
        </a>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) return alert("Selecciona una calificación")
    if (!comment.trim()) return alert("Escribe un comentario")

    setLoading(true)
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, placeId, accommodationId, restaurantId }),
      })
      setSuccess(true)
      setRating(0)
      setComment("")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ background: "#0f2318", borderRadius: "12px", padding: "24px", textAlign: "center", border: "1px solid #1a3d2b" }}>
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎉</div>
        <p style={{ color: "#6ee7b7", fontWeight: 600, margin: 0 }}>¡Reseña publicada exitosamente!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "#141414", borderRadius: "12px", padding: "24px", border: "1px solid #2a2a2a" }}>
      <h3 style={{ color: "white", fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
        Escribe tu reseña
      </h3>

      {/* Estrellas */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "16px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
          >
            <Star
              size={28}
              style={{
                fill: star <= (hovered || rating) ? "#fbbf24" : "transparent",
                color: star <= (hovered || rating) ? "#fbbf24" : "rgba(255,255,255,0.2)",
                transition: "all 0.1s",
              }}
            />
          </button>
        ))}
        {rating > 0 && (
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginLeft: "8px" }}>
            {["", "Malo", "Regular", "Bueno", "Muy bueno", "Excelente"][rating]}
          </span>
        )}
      </div>

      {/* Comentario */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Cuéntanos tu experiencia..."
        rows={3}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "10px",
          color: "white",
          fontSize: "14px",
          resize: "none",
          outline: "none",
          marginBottom: "14px",
          boxSizing: "border-box",
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          background: loading ? "#1a3d2b" : "#15803d",
          color: "white",
          border: "none",
          padding: "11px 24px",
          borderRadius: "10px",
          fontWeight: 600,
          fontSize: "14px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Publicando..." : "Publicar reseña"}
      </button>
    </form>
  )
}