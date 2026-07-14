"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DeleteRestaurantButton({
  restaurantId,
}: {
  restaurantId: string
}) {
  const router = useRouter()

  async function handleDelete() {
    const confirmed = confirm(
      "¿Estás seguro de eliminar este restaurante?"
    )

    if (!confirmed) return

    try {
      const response = await fetch(
        `/api/admin/restaurantes/${restaurantId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("No se pudo eliminar el restaurante")
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Ocurrió un error al eliminar el restaurante.")
    }
  }

  return (
    <button
      onClick={handleDelete}
      title="Eliminar"
      className="flex items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-2 text-gray-400 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-500"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}