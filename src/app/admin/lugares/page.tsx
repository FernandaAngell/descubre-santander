import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Pencil, Eye } from "lucide-react"
import DeleteLugarButton from "@/components/admin/DeleteLugarButton"

export default async function AdminLugaresPage() {
  const places = await prisma.place.findMany({
    include: { municipality: true, category: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lugares</h1>
          <p className="text-gray-500 mt-1">{places.length} lugares registrados</p>
        </div>
        <Link
          href="/admin/lugares/nuevo"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo lugar
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Nombre</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Municipio</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Categoría</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {places.map((place) => (
              <tr key={place.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{place.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{place.slug}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{place.municipality.name}</td>
                <td className="px-6 py-4">
                  <span className="text-sm flex items-center gap-1">
                    {place.category.icon} {place.category.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    place.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {place.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/lugares/${place.slug}`}
                      target="_blank"
                      className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/lugares/${place.id}/editar`}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteLugarButton placeId={place.id} />
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