import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MapPin, Filter } from "lucide-react"
import { Place, Municipality, Category } from "@prisma/client"

type PlaceWithRelations = Place & {
  municipality: Municipality
  category: Category
}

interface Props {
  searchParams: Promise<{ categoria?: string; municipio?: string; q?: string }>
}

export default async function LugaresPage({ searchParams }: Props) {
  const params = await searchParams
  const { categoria, municipio, q } = params

  const [places, categories, municipalities] = await Promise.all([
    prisma.place.findMany({
      where: {
        status: "PUBLISHED",
        ...(categoria && { category: { slug: categoria } }),
        ...(municipio && { municipality: { slug: municipio } }),
        ...(q && {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }),
      },
      include: { municipality: true, category: true },
      orderBy: { featured: "desc" },
    }),
    prisma.category.findMany(),
    prisma.municipality.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-emerald-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Lugares turísticos</h1>
          <p className="text-emerald-200 text-lg">
            Descubre los destinos más increíbles de Santander
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar filtros */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-2 font-semibold text-gray-900 mb-6">
                <Filter className="w-4 h-4" />
                Filtros
              </div>

              {/* Buscador */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <form>
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Nombre o descripción..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  {categoria && <input type="hidden" name="categoria" value={categoria} />}
                  {municipio && <input type="hidden" name="municipio" value={municipio} />}
                  <button
                    type="submit"
                    className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                  >
                    Buscar
                  </button>
                </form>
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categoría
                </label>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/lugares"
                    className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                      !categoria
                        ? "bg-emerald-50 text-emerald-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Todas
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/lugares?categoria=${cat.slug}`}
                      className={`text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        categoria === cat.slug
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Municipios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Municipio
                </label>
                <div className="flex flex-col gap-2">
                  <Link
                    href={categoria ? `/lugares?categoria=${categoria}` : "/lugares"}
                    className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                      !municipio
                        ? "bg-emerald-50 text-emerald-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Todos
                  </Link>
                  {municipalities.map((mun) => (
                    <Link
                      key={mun.id}
                      href={`/lugares?municipio=${mun.slug}${categoria ? `&categoria=${categoria}` : ""}`}
                      className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                        municipio === mun.slug
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {mun.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de lugares */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                <span className="font-semibold text-gray-900">{places.length}</span> lugares encontrados
              </p>
            </div>

            {places.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No encontramos resultados
                </h3>
                <p className="text-gray-500 mb-6">
                  Intenta con otros filtros o términos de búsqueda
                </p>
                <Link
                  href="/lugares"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  Ver todos los lugares
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {places.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaceCard({ place }: { place: PlaceWithRelations }) {
  const difficultyLabel: Record<string, string> = {
    EASY: "Fácil",
    MODERATE: "Moderado",
    HARD: "Difícil",
  }

  const difficultyColor: Record<string, string> = {
    EASY: "text-green-600 bg-green-50",
    MODERATE: "text-amber-600 bg-amber-50",
    HARD: "text-red-600 bg-red-50",
  }

  return (
    <Link
      href={`/lugares/${place.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Imagen */}
      <div className="h-48 bg-gradient-to-br from-emerald-400 to-teal-600 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-30">{place.category.icon}</span>
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: place.category.color }}
          >
            {place.category.name}
          </span>
        </div>
        {place.featured && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-400 text-yellow-900">
              Destacado
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
          {place.name}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>{place.municipality.name}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
          {place.description}
        </p>

        <div className="flex items-center justify-between">
          {place.difficulty && (
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${difficultyColor[place.difficulty]}`}>
              {difficultyLabel[place.difficulty]}
            </span>
          )}
          {place.entryFee !== null && (
            <span className="text-sm font-semibold text-gray-700 ml-auto">
              {place.entryFee === 0 ? "Entrada gratis" : `$${place.entryFee?.toLocaleString("es-CO")}`}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}