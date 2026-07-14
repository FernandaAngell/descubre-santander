
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function NuevoLugarPage() {
  const [categories, municipalities] = await Promise.all([
    prisma.category.findMany(),
    prisma.municipality.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ])

  async function createPlace(formData: FormData) {
    "use server"

    const name = formData.get("name") as string

    const slug = name
      .toLowerCase()
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
        entryFee: formData.get("entryFee")
          ? parseFloat(formData.get("entryFee") as string)
          : null,
        latitude: parseFloat(formData.get("latitude") as string),
        longitude: parseFloat(formData.get("longitude") as string),
        difficulty: formData.get("difficulty") as any || null,
        status: formData.get("status") as any,
        featured: formData.get("featured") === "on",
        tips: (formData.get("tips") as string)
          .split("\n")
          .filter((t) => t.trim()),
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
    <div className="min-h-screen bg-[#080808]">

      <div className="mx-auto max-w-6xl px-8 py-10">

        <div className="mb-12">

          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">

            Panel administrativo

          </span>

          <h1 className="mt-6 font-[var(--font-display)] text-5xl text-white">

            Nuevo lugar

          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">

            Agrega un nuevo destino turístico para que aparezca
            en Descubre Santander.

          </p>

        </div>

        <form
          action={createPlace}
          className="rounded-[32px] border border-white/10 bg-[#121212] p-10 shadow-2xl"
        >

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

            <div className="md:col-span-2">

              <label className="mb-3 block text-sm font-medium text-zinc-300">

                Nombre *

              </label>

              <input
                name="name"
                required
                placeholder="Ej. Cañón del Chicamocha"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-3 block text-sm font-medium text-zinc-300">

                Descripción *

              </label>

              <textarea
                name="description"
                rows={5}
                required
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />

            </div>
                        <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Municipio *
              </label>

              <select
                name="municipalityId"
                required
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Selecciona un municipio</option>

                {municipalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Categoría *
              </label>

              <select
                name="categoryId"
                required
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Selecciona una categoría</option>

                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Latitud *
              </label>

              <input
                name="latitude"
                type="number"
                step="any"
                required
                placeholder="6.5564"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Longitud *
              </label>

              <input
                name="longitude"
                type="number"
                step="any"
                required
                placeholder="-73.1360"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Dificultad
              </label>

              <select
                name="difficulty"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Sin especificar</option>
                <option value="EASY">Fácil</option>
                <option value="MODERATE">Moderado</option>
                <option value="HARD">Difícil</option>
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Precio de entrada
              </label>

              <input
                name="entryFee"
                type="number"
                step="any"
                placeholder="0 = Gratis"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Mejor época
              </label>

              <input
                name="bestTime"
                placeholder="Diciembre a marzo"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Dirección
              </label>

              <input
                name="address"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
                        <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Estado
              </label>

              <select
                name="status"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="DRAFT">Borrador</option>
                <option value="PUBLISHED">Publicado</option>
              </select>
            </div>

            <div className="flex items-center rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4">

              <input
                id="featured"
                type="checkbox"
                name="featured"
                className="h-5 w-5 rounded accent-emerald-500"
              />

              <label
                htmlFor="featured"
                className="ml-4 text-sm font-medium text-zinc-300"
              >
                Marcar como destino destacado
              </label>

            </div>

            <div className="md:col-span-2">

              <label className="mb-3 block text-sm font-medium text-zinc-300">

                Consejos útiles

              </label>

              <textarea
                rows={5}
                name="tips"
                placeholder={`Lleva protector solar
Visita en la mañana
Usa calzado cómodo`}
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />

            </div>

          </div>

          <div className="mt-12 flex items-center justify-end gap-4 border-t border-white/10 pt-8">

            <a
              href="/admin/lugares"
              className="rounded-full border border-white/10 px-7 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5"
            >
              Cancelar
            </a>

            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/20"
            >
              Crear lugar
            </button>

          </div>

        </form>

      </div>

    </div>

  )
}