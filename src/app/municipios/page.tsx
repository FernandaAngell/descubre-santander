import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MapPin, Mountain, Thermometer, Users } from "lucide-react"

export default async function MunicipiosPage() {
  const municipalities = await prisma.municipality.findMany({
    include: {
      _count: {
        select: {
          places: true,
          accommodations: true,
          restaurants: true,
        },
      },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-teal-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Municipios</h1>
          <p className="text-teal-200 text-lg">
            Explora los {municipalities.length} municipios de Santander
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {municipalities.map((mun) => (
            <Link
              key={mun.id}
              href={`/municipios/${mun.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Imagen */}
              <div className="h-44 bg-gradient-to-br from-teal-500 to-emerald-700 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl opacity-20">🏔️</span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-teal-700">
                    {mun.department}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-xl mb-1 group-hover:text-teal-600 transition-colors">
                  {mun.name}
                </h3>

                {/* Stats */}
                <div className="flex items-center gap-4 my-3">
                  {mun.altitude && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Mountain className="w-3.5 h-3.5" />
                      <span>{mun.altitude}m</span>
                    </div>
                  )}
                  {mun.weather && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Thermometer className="w-3.5 h-3.5" />
                      <span>{mun.weather}</span>
                    </div>
                  )}
                </div>

                {mun.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
                    {mun.description}
                  </p>
                )}

                {/* Conteos */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{mun._count.places}</div>
                    <div className="text-xs text-gray-500">Lugares</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{mun._count.accommodations}</div>
                    <div className="text-xs text-gray-500">Alojamientos</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{mun._count.restaurants}</div>
                    <div className="text-xs text-gray-500">Restaurantes</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}