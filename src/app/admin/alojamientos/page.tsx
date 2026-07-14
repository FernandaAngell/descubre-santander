import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Pencil, Eye } from "lucide-react"
import DeleteAlojamientoButton from "@/components/admin/DeleteAlojamientoButton"

export default async function AdminAlojamientosPage() {
  const accommodations = await prisma.accommodation.findMany({
    include: { municipality: true },
    orderBy: { createdAt: "desc" },
  })

  const tipoLabels: Record<string, string> = {
    GLAMPING: "Glamping",
    HOTEL: "Hotel",
    CABANA: "Cabaña",
    HOSTAL: "Hostal",
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h1 style={{ color: "white", fontSize: "28px", fontWeight: 700, margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
            Alojamientos
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>
            {accommodations.length} alojamientos registrados
          </p>
        </div>
        <Link href="/admin/alojamientos/nuevo" style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "#15803d", color: "white",
          padding: "10px 20px", borderRadius: "10px",
          textDecoration: "none", fontWeight: 600, fontSize: "13px",
        }}>
          <Plus size={15} />
          Nuevo alojamiento
        </Link>
      </div>

      <div style={{ background: "#141414", borderRadius: "16px", border: "1px solid #2a2a2a", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
              <th style={{ textAlign: "left", padding: "14px 20px", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Nombre</th>
              <th style={{ textAlign: "left", padding: "14px 20px", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Tipo</th>
              <th style={{ textAlign: "left", padding: "14px 20px", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Municipio</th>
              <th style={{ textAlign: "left", padding: "14px 20px", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Precio desde</th>
              <th style={{ textAlign: "left", padding: "14px 20px", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Estado</th>
              <th style={{ textAlign: "left", padding: "14px 20px", color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {accommodations.map((acc) => (
              <tr key={acc.id} style={{ borderBottom: "1px solid #1f1f1f" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ color: "white", fontSize: "14px", fontWeight: 600 }}>{acc.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "2px" }}>{acc.slug}</div>
                </td>
                <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{tipoLabels[acc.type]}</td>
                <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{acc.municipality.name}</td>
                <td style={{ padding: "16px 20px", color: "#6ee7b7", fontSize: "13px", fontWeight: 600 }}>${acc.priceMin.toLocaleString("es-CO")}</td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px",
                    background: acc.status === "PUBLISHED" ? "#0f2318" : "#2a2410",
                    color: acc.status === "PUBLISHED" ? "#6ee7b7" : "#fbbf24",
                    border: acc.status === "PUBLISHED" ? "1px solid #1a3d2b" : "1px solid #4a3d1a",
                  }}>
                    {acc.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Link href={`/alojamientos/${acc.slug}`} target="_blank" style={{
                      padding: "8px", borderRadius: "8px", color: "rgba(255,255,255,0.4)",
                      display: "flex", background: "#1a1a1a", border: "1px solid #2a2a2a",
                    }}>
                      <Eye size={14} />
                    </Link>
                    <Link href={`/admin/alojamientos/${acc.id}/editar`} style={{
                      padding: "8px", borderRadius: "8px", color: "rgba(255,255,255,0.4)",
                      display: "flex", background: "#1a1a1a", border: "1px solid #2a2a2a",
                    }}>
                      <Pencil size={14} />
                    </Link>
                    <DeleteAlojamientoButton accommodationId={acc.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}