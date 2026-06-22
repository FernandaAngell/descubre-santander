import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MapPin, Users, Phone } from "lucide-react"
import { Accommodation, Municipality } from "@prisma/client"

type AccommodationWithMunicipality = Accommodation & {
  municipality: Municipality
}

interface Props {
  searchParams: Promise<{ tipo?: string; municipio?: string }>
}

const tipoLabels: Record<string, string> = {
  GLAMPING: "Glamping",
  HOTEL: "Hotel",
  CABANA: "Cabaña",
  HOSTAL: "Hostal",
}

const tipoColors: Record<string, string> = {
  GLAMPING: "bg-purple-100 text-purple-700",
  HOTEL: "bg-blue-100 text-blue-700",
  CABANA: "bg-amber-100 text-amber-700",
  HOSTAL: "bg-green-100 text-green-700",
}

const idealForLabels: Record<string, string> = {
  PAREJAS: "Parejas",
  FAMILIAS: "Familias",
  GRUPOS: "Grupos",
  TODOS: "Todos",
}

export default async function AlojamientosPage({ searchParams }: Props) {
  const params = await searchParams
  const { tipo, municipio } = params

  const [accommodations, municipalities] = await Promise.all([
    prisma.accommodation.findMany({
      where: {
        status: "PUBLISHED",
        ...(tipo && { type: tipo as any }),
        ...(municipio && { municipality: { slug: municipio } }),
      },
      include: { municipality: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.municipality.findMany({ orderBy: { name: "asc" } }),
  ])

  const tipos = ["GLAMPING", "HOTEL", "CABANA", "HOSTAL"]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-purple-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Alojamientos</h1>
          <p className="text-purple-200 text-lg">
            Glampings, hoteles, cabañas y hostales en Santander
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Filtros tipo */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/alojamientos"
            className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${
              !tipo
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"
            }`}
          >
            Todos
          </Link>
          {tipos.map((t) => (
            <Link
              key={t}
              href={`/alojamientos?tipo=${t}${municipio ? `&municipio=${municipio}` : ""}`}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${
                tipo === t
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"
              }`}
            >
              {tipoLabels[t]}
            </Link>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar municipios */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <div className="font-semibold text-gray-900 mb-4">Municipio</div>
              <div className="flex flex-col gap-2">
                <Link
                  href={tipo ? `/alojamientos?tipo=${tipo}` : "/alojamientos"}
                  className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                    !municipio
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Todos
                </Link>
                {municipalities.map((mun) => (
                  <Link
                    key={mun.id}
                    href={`/alojamientos?municipio=${mun.slug}${tipo ? `&tipo=${tipo}` : ""}`}
                    className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                      municipio === mun.slug
                        ? "bg-purple-50 text-purple-700 font-medium"
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
              <span className="font-semibold text-gray-900">{accommodations.length}</span> alojamientos encontrados
            </p>

            {accommodations.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🏕️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay alojamientos disponibles
                </h3>
                <p className="text-gray-500 mb-6">Intenta con otros filtros</p>
                <Link
                  href="/alojamientos"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  Ver todos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accommodations.map((acc) => (
                  <AccommodationCard key={acc.id} accommodation={acc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AccommodationCard({ accommodation: acc }: { accommodation: AccommodationWithMunicipality }) {
  return (
    <Link
      href={`/alojamientos/${acc.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Imagen */}
      <div className="h-52 bg-gradient-to-br from-purple-400 to-indigo-600 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl opacity-20">
            {acc.type === "GLAMPING" ? "⛺" : acc.type === "HOTEL" ? "🏨" : acc.type === "CABANA" ? "🏡" : "🛏️"}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tipoColors[acc.type]}`}>
            {tipoLabels[acc.type]}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2">
          <div className="text-xs text-gray-500">Desde</div>
          <div className="font-bold text-gray-900">
            ${acc.priceMin.toLocaleString("es-CO")}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">
          {acc.name}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>{acc.municipality.name}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
          {acc.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Ideal para {idealForLabels[acc.idealFor]}</span>
          </div>
          {acc.capacity && (
            <span className="text-xs text-gray-500">
              Hasta {acc.capacity} personas
            </span>
          )}
        </div>

        {acc.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {acc.amenities.slice(0, 3).map((amenity, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {amenity}
              </span>
            ))}
            {acc.amenities.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                +{acc.amenities.length - 3} más
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}