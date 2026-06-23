"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DeleteLugarButton({ placeId }: { placeId: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar este lugar?")) return

    await fetch(`/api/admin/lugares/${placeId}`, {
      method: "DELETE",
    })

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Eliminar"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}