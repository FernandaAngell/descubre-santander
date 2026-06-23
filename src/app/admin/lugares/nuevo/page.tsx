import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function NuevoLugarPage() {
  const [categories, municipalities] = await Promise.all([
    prisma.category.findMany(),
    prisma.municipality.findMany({ orderBy: { name: "asc" } }),
  ])

  async function createPlace(formData: FormData) {
    "use server"

    const name = formData.get("name") as string
    const slug = name.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[áàä]/g, "a")
      .replace(/[éèë]/g, "e")
      .replace(/[íìï]/g, "i")
      .replace(/[óòö]/g, "o")
      .replace(/[úùü]/g, "u")
      .replace(/ñ/g, "n")
      .replace(/[^a-z0-9-]/g, "")

    await prisma.place.create({
      data: {
        name,
        slug,
        description: formData.get("description") as string,
        address: formData.get("address") as string || null,
        bestTime: formData.get("bestTime") as string || null,
        entryFee: formData.get("entryFee") ? parseFloat(formData.get("entryFee") as string) : null,
        latitude: parseFloat(formData.get("latitude") as string),
        longitude: parseFloat(formData.get("longitude") as string),
        difficulty: formData.get("difficulty") as any || null,
        status: formData.get("status") as any,
        featured: formData.get("featured") === "on",
        tips: (formData.get("tips") as string).split("\n").filter(t => t.trim()),
        images: [],
        municipalityId: formData.get("municipalityId") as string,
        categoryId: formData.get("categoryId") as string,
      },
    })

    revalidatePath("/admin/lugares")
    revalidatePath("/lugares")
    redirect("/admin/lugares")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo lugar</h1>
        <p className="text-gray-500 mt-1">Agrega un nuevo destino turístico</p>
      </div>

      <form action={createPlace} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
            <input name="name" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
            <textarea name="description" required rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Municipio *</label>
            <select name="municipalityId" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400">
              <option value="">Selecciona un municipio</option>
              {municipalities.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
            <select name="categoryId" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400">
              <option value="">Selecciona una categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Latitud *</label>
            <input name="latitude" type="number" step="any" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="6.5564" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Longitud *</label>
            <input name="longitude" type="number" step="any" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="-73.1360" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dificultad</label>
            <select name="difficulty" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400">
              <option value="">Sin especificar</option>
              <option value="EASY">Fácil</option>
              <option value="MODERATE">Moderado</option>
              <option value="HARD">Difícil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Precio de entrada</label>
            <input name="entryFee" type="number" step="any" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="0 = gratis" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mejor época para visitar</label>
            <input name="bestTime" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Diciembre a marzo" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input name="address" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select name="status" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400">
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicado</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="featured" id="featured" className="w-4 h-4 accent-emerald-600" />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Marcar como destacado</label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consejos útiles <span className="text-gray-400 font-normal">(uno por línea)</span>
            </label>
            <textarea name="tips" rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Lleva protector solar&#10;Visita en la mañana&#10;El acceso es por la vía principal" />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3 rounded-xl transition-colors"
          >
            Crear lugar
          </button>
          <a href="/admin/lugares" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}