import Link from "next/link"
import { MapPin, Star } from "lucide-react"
import { Place, Municipality, Category } from "@prisma/client"

type PlaceWithRelations = Place & {
  municipality: Municipality
  category: Category
}

interface Props {
  places: PlaceWithRelations[]
}

export default function FeaturedPlaces({ places }: Props) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lugares destacados
            </h2>
            <p className="text-gray-500 text-lg">
              Los destinos más visitados de Santander
            </p>
          </div>
          <Link
            href="/lugares"
            className="hidden md:inline-flex text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <Link
              key={place.id}
              href={`/lugares/${place.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Imagen placeholder */}
              <div className="h-48 bg-gradient-to-br from-emerald-400 to-teal-600 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl opacity-30">{place.category.icon}</span>
                </div>
                <div className="absolute top-3 left-3">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: place.category.color }}
                  >
                    {place.category.name}
                  </span>
                </div>
                {place.entryFee === 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-emerald-600">
                      Gratis
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
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {place.description}
                </p>

                {place.bestTime && (
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    Mejor época: <span className="font-medium text-gray-700">{place.bestTime}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/lugares"
            className="inline-flex bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3 rounded-xl transition-colors"
          >
            Ver todos los lugares
          </Link>
        </div>
      </div>
    </section>
  )
}