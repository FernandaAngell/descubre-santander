import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function NuevoRestaurantePage() {

  const municipalities = await prisma.municipality.findMany({
    orderBy: {
      name: "asc",
    },
  })

  async function createRestaurant(formData: FormData) {
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

    await prisma.restaurant.create({
      data: {
        name,
        slug,
        description: formData.get("description") as string,
        foodType: formData.get("foodType") as string,
        specialties: formData.getAll("specialties") as string[],
        priceAvg: parseFloat(formData.get("priceAvg") as string),
        schedule: formData.get("schedule") as string || null,
        phone: formData.get("phone") as string || null,
        address: formData.get("address") as string || null,
        municipalityId: formData.get("municipalityId") as string,
        images: [],
        status: formData.get("status") as any,
      },
    })

    revalidatePath("/admin/restaurantes")
    revalidatePath("/restaurantes")

    redirect("/admin/restaurantes")
  }

  return (
    <div className="min-h-screen bg-[#080808]">

      <div className="mx-auto max-w-6xl px-8 py-10">

        <div className="mb-12">

          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
            Panel administrativo
          </span>

          <h1 className="mt-6 font-[var(--font-display)] text-5xl text-white">
            Nuevo restaurante
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
            Agrega un nuevo restaurante para Descubre Santander.
          </p>

        </div>

        <form
          action={createRestaurant}
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
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />

            </div>

            <div>

              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Tipo de comida
              </label>

              <input
                name="foodType"
                placeholder="Santandereana"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />

            </div>

            <div>

              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Precio promedio
              </label>

              <input
                type="number"
                step="any"
                name="priceAvg"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Descripción
              </label>

              <textarea
                rows={5}
                name="description"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />

            </div>
                        <div>

              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Municipio *
              </label>

              <select
                name="municipalityId"
                required
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white outline-none focus:border-emerald-500"
              >
                <option value="">
                  Selecciona un municipio
                </option>

                {municipalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}

              </select>

            </div>

            <div>

              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Dirección
              </label>

              <input
                name="address"
                placeholder="Cra 7 # 5-21"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />

            </div>

            <div>

              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Teléfono
              </label>

              <input
                name="phone"
                placeholder="+57 300 123 4567"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />

            </div>

            <div>

              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Horario
              </label>

              <input
                name="schedule"
                placeholder="Lunes a Domingo · 8:00 AM - 10:00 PM"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-4 block text-sm font-medium text-zinc-300">
                Especialidades
              </label>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

                {[
                  "Mute santandereano",
                  "Cabro",
                  "Hormigas culonas",
                  "Carne oreada",
                  "Trucha",
                  "Arepa santandereana",
                  "Hamburguesas",
                  "Pizza",
                  "Parrilla",
                  "Comida rápida",
                  "Postres",
                  "Café",
                ].map((item) => (

                  <label
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-zinc-300 hover:border-emerald-500 transition"
                  >

                    <input
                      type="checkbox"
                      name="specialties"
                      value={item}
                      className="h-4 w-4 accent-emerald-500"
                    />

                    {item}

                  </label>

                ))}

              </div>

            </div>
                        <div>

              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Estado
              </label>

              <select
                name="status"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="DRAFT">
                  Borrador
                </option>

                <option value="PUBLISHED">
                  Publicado
                </option>

              </select>

            </div>

            <div className="flex items-end">

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-5 w-full">

                <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">
                  Información
                </p>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Las imágenes se podrán agregar desde la edición del restaurante.
                </p>

              </div>

            </div>

          </div>

          <div className="mt-12 flex items-center justify-end gap-4 border-t border-white/10 pt-8">

            <a
              href="/admin/restaurantes"
              className="rounded-full border border-white/10 px-7 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5"
            >
              Cancelar
            </a>

            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/20"
            >
              Crear restaurante
            </button>

          </div>

        </form>

      </div>

    </div>

  )
}