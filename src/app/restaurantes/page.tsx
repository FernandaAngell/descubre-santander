import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MapPin, Star, Clock, Phone } from "lucide-react"
import { Restaurant, Municipality } from "@prisma/client"

type RestaurantWithMunicipality = Restaurant & {
  municipality: Municipality
}

interface Props {
  searchParams: Promise<{ municipio?: string; tipo?: string }>
}

export default async function RestaurantesPage({ searchParams }: Props) {
  const params = await searchParams
  const { municipio, tipo } = params

  const [restaurants, municipalities] = await Promise.all([
    prisma.restaurant.findMany({
      where: {
        status: "PUBLISHED",
        ...(municipio && { municipality: { slug: municipio } }),
        ...(tipo && { foodType: { contains: tipo, mode: "insensitive" } }),
      },
      include: { municipality: true },
      orderBy: { rating: "desc" },
    }),
    prisma.municipality.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-orange-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Restaurantes</h1>
          <p className="text-orange-200 text-lg">
            La mejor gastronomía típica de Santander
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <div className="font-semibold text-gray-900 mb-4">Municipio</div>
              <div className="flex flex-col gap-2">
                <Link
                  href="/restaurantes"
                  className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                    !municipio
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Todos
                </Link>
                {municipalities.map((mun) => (
                  <Link
                    key={mun.id}
                    href={`/restaurantes?municipio=${mun.slug}`}
                    className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                      municipio === mun.slug
                        ? "bg-orange-50 text-orange-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {mun.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-6">
              <span className="font-semibold text-gray-900">{restaurants.length}</span> restaurantes encontrados
            </p>

            {restaurants.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay restaurantes disponibles
                </h3>
                <p className="text-gray-500 mb-6">Intenta con otros filtros</p>
                <Link
                  href="/restaurantes"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  Ver todos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RestaurantCard({ restaurant: r }: { restaurant: RestaurantWithMunicipality }) {
  const stars = Math.round(r.rating)

  return (
    <Link
      href={`/restaurantes/${r.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Imagen */}
      <div className="h-44 bg-gradient-to-br from-orange-400 to-red-500 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl opacity-20">🍽️</span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-orange-700">
            {r.foodType}
          </span>
        </div>
        {r.rating > 0 && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-gray-900 text-sm">{r.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
          {r.name}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>{r.municipality.name}</span>
        </div>

        {r.specialties.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1.5">Especialidades</div>
            <div className="flex flex-wrap gap-1">
              {r.specialties.slice(0, 3).map((s, i) => (
                <span key={i} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full">
                  {s}
                </span>
              ))}
              {r.specialties.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  +{r.specialties.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Precio promedio
          </div>
          <div className="font-bold text-gray-900">
            ${r.priceAvg.toLocaleString("es-CO")}
          </div>
        </div>

        {r.schedule && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{r.schedule}</span>
          </div>
        )}
      </div>
    </Link>
  )
}