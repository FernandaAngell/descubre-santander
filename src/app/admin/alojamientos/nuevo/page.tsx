import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function NuevoAlojamientoPage() {
  const municipalities = await prisma.municipality.findMany({
    orderBy: {
      name: "asc",
    },
  })

  async function createAccommodation(formData: FormData) {
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

    await prisma.accommodation.create({
      data: {
        name,
        slug,
        description: formData.get("description") as string,
        type: formData.get("type") as any,
        idealFor: formData.get("idealFor") as any,
        municipalityId: formData.get("municipalityId") as string,
        address: formData.get("address") as string || null,
        latitude: parseFloat(formData.get("latitude") as string),
        longitude: parseFloat(formData.get("longitude") as string),
        priceMin: parseFloat(formData.get("priceMin") as string),
        priceMax: parseFloat(formData.get("priceMax") as string),
        capacity: formData.get("capacity")
          ? parseInt(formData.get("capacity") as string)
          : null,
        checkIn: formData.get("checkIn") as string || null,
        checkOut: formData.get("checkOut") as string || null,
        phone: formData.get("phone") as string || null,
        contactUrl: formData.get("contactUrl") as string || null,
        amenities: formData.getAll("amenities") as string[],
        images: [],
        status: formData.get("status") as any,
      },
    })

    revalidatePath("/admin/alojamientos")
    revalidatePath("/alojamientos")

    redirect("/admin/alojamientos")
  }

  return (
    <div className="min-h-screen bg-[#080808]">

      <div className="mx-auto max-w-6xl px-8 py-10">

        <div className="mb-12">

          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
            Panel administrativo
          </span>

          <h1 className="mt-6 font-[var(--font-display)] text-5xl text-white">
            Nuevo alojamiento
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
            Agrega un nuevo alojamiento para Descubre Santander.
          </p>

        </div>

        <form
          action={createAccommodation}
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
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white outline-none focus:border-emerald-500"
              />

            </div>

            <div>

              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Tipo *
              </label>

              <select
                name="type"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              >
                <option value="HOTEL">Hotel</option>
                <option value="HOSTAL">Hostal</option>
                <option value="GLAMPING">Glamping</option>
                <option value="CABANA">Cabaña</option>
              </select>

            </div>

            <div>

              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Ideal para
              </label>

              <select
                name="idealFor"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              >
                <option value="TODOS">Todos</option>
                <option value="PAREJAS">Parejas</option>
                <option value="FAMILIAS">Familias</option>
                <option value="GRUPOS">Grupos</option>
              </select>

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
                Dirección
              </label>

              <input
                name="address"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Latitud *
              </label>

              <input
                type="number"
                step="any"
                required
                name="latitude"
                placeholder="6.5564"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Longitud *
              </label>

              <input
                type="number"
                step="any"
                required
                name="longitude"
                placeholder="-73.1360"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Precio mínimo
              </label>

              <input
                type="number"
                step="any"
                name="priceMin"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Precio máximo
              </label>

              <input
                type="number"
                step="any"
                name="priceMax"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Capacidad máxima
              </label>

              <input
                type="number"
                name="capacity"
                placeholder="8"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Check In
              </label>

              <input
                type="time"
                name="checkIn"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Check Out
              </label>

              <input
                type="time"
                name="checkOut"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Teléfono
              </label>

              <input
                name="phone"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Link de reservas / WhatsApp
              </label>

              <input
                name="contactUrl"
                placeholder="https://wa.me/573001112233"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white"
              />
            </div>
                        <div className="md:col-span-2">

              <label className="mb-4 block text-sm font-medium text-zinc-300">
                Servicios
              </label>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

                {[
                  "Wifi",
                  "Piscina",
                  "Jacuzzi",
                  "Parqueadero",
                  "Restaurante",
                  "Desayuno",
                  "BBQ",
                  "Chimenea",
                  "Cocina",
                  "Aire acondicionado",
                  "Agua caliente",
                  "Pet Friendly",
                  "TV",
                  "Vista a la montaña",
                  "Vista al río",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-zinc-300 transition hover:border-emerald-500"
                  >
                    <input
                      type="checkbox"
                      name="amenities"
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
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4 text-white outline-none focus:border-emerald-500"
              >
                <option value="DRAFT">
                  Borrador
                </option>

                <option value="PUBLISHED">
                  Publicado
                </option>

              </select>

            </div>

          </div>

          <div className="mt-12 flex items-center justify-end gap-4 border-t border-white/10 pt-8">

            <a
              href="/admin/alojamientos"
              className="rounded-full border border-white/10 px-7 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5"
            >
              Cancelar
            </a>

            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/20"
            >
              Crear alojamiento
            </button>

          </div>

        </form>

      </div>

    </div>

  )
}