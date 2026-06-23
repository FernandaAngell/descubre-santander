"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Props {
  placeId: string
  initialFavorited?: boolean
}

export default function FavoriteButton({ placeId, initialFavorited = false }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    if (!session) {
      router.push("/auth/login")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId }),
      })
      const data = await res.json()
      setFavorited(data.favorited)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200",
        favorited
          ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
          : "bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-500"
      )}
    >
      <Heart
        className={cn("w-4 h-4 transition-all", favorited && "fill-red-500")}
      />
      {favorited ? "Guardado" : "Guardar"}
    </button>
  )
}