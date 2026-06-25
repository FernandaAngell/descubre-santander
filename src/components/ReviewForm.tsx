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
      <div className="bg-gray-50 rounded-2xl p-6 text-center">
        <p className="text-gray-600 mb-4">Inicia sesión para dejar una reseña</p>
        <a
          href="/auth/login"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
        >
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
      <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
        <div className="text-4xl mb-2">🎉</div>
        <p className="text-emerald-700 font-medium">¡Reseña publicada exitosamente!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4">Escribe tu reseña</h3>

      {/* Estrellas */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hovered || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-sm text-gray-600 ml-2">
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
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-sm resize-none mb-4"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
      >
        {loading ? "Publicando..." : "Publicar reseña"}
      </button>
    </form>
  )
}