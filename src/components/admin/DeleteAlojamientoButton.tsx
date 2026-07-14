"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DeleteAlojamientoButton({ accommodationId }: { accommodationId: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar este alojamiento?")) return
    await fetch(`/api/admin/alojamientos/${accommodationId}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <button onClick={handleDelete} style={{
      padding: "8px", borderRadius: "8px", color: "#f87171",
      display: "flex", background: "#1a1a1a", border: "1px solid #2a2a2a",
      cursor: "pointer",
    }}>
      <Trash2 size={14} />
    </button>
  )
}