import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { MapPin, Clock, DollarSign, AlertTriangle, Lightbulb } from "lucide-react"
import Link from "next/link"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function LugarDetailPage({ params }: Props) {
  const { slug } = await params

  const place = await prisma.place.findUnique({
    where: { slug },
    include: {
      municipality: true,
      category: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!place || place.status !== "PUBLISHED") {
    notFound()
  }

  const difficultyLabel: Record<string, string> = {
    EASY: "Fácil",
    MODERATE: "Moderado",
    HARD: "Difícil",
  }

  const difficultyColor: Record<string, string> = {
    EASY: "text-green-700 bg-green-100",
    MODERATE: "text-amber-700 bg-amber-100",
    HARD: "text-red-700 bg-red-100",
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero del lugar */}
      <div className="h-72 md:h-96 bg-gradient-to-br from-emerald-600 to-teal-800 relative flex items-end">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-9xl opacity-20">{place.category.icon}</span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-8 w-full">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: place.category.color }}
            >
              {place.category.name}
            </span>
            {place.featured && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-400 text-yellow-900">
                Destacado
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {place.name}
          </h1>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <Link
              href={`/municipios/${place.municipality.slug}`}
              className="hover:text-white transition-colors"
            >
              {place.municipality.name}, Santander
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Contenido principal */}
          <div className="flex-1">

            {/* Info rápida */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {place.difficulty && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Dificultad</div>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${difficultyColor[place.difficulty]}`}>
                    {difficultyLabel[place.difficulty]}
                  </span>
                </div>
              )}
              {place.entryFee !== null && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Entrada</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {place.entryFee === 0 ? "Gratis" : `$${place.entryFee.toLocaleString("es-CO")}`}
                  </div>
                </div>
              )}
              {place.bestTime && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Mejor época</div>
                  <div className="text-sm font-semibold text-gray-900">{place.bestTime}</div>
                </div>
              )}
              {place.address && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Dirección</div>
                  <div className="text-sm font-semibold text-gray-900 line-clamp-2">{place.address}</div>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre este lugar</h2>
              <p className="text-gray-600 leading-relaxed">{place.description}</p>
            </div>

            {/* Tips */}
            {place.tips && place.tips.length > 0 && (
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-xl font-bold text-gray-900">Consejos útiles</h2>
                </div>
                <ul className="flex flex-col gap-3">
                  {place.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reseñas */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Reseñas {place.reviews.length > 0 && `(${place.reviews.length})`}
              </h2>
              {place.reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-3">💬</div>
                  <p>Aún no hay reseñas. ¡Sé el primero!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {place.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-sm">
                          {review.user.name?.[0] ?? "U"}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{review.user.name}</div>
                          <div className="text-yellow-500 text-xs">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">

            {/* Mapa placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              <div className="h-56 bg-gradient-to-br from-teal-100 to-emerald-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-10 h-10 mx-auto mb-2 text-emerald-600" />
                  <p className="text-sm font-medium">Mapa próximamente</p>
                  <p className="text-xs mt-1">{place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 font-medium">{place.address || place.municipality.name}</p>
              </div>
            </div>

            {/* Municipio */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Municipio</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{place.municipality.name}</div>
                  {place.municipality.weather && (
                    <div className="text-xs text-gray-500">{place.municipality.weather}</div>
                  )}
                </div>
              </div>
              {place.municipality.description && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                  {place.municipality.description}
                </p>
              )}
              <Link
                href={`/municipios/${place.municipality.slug}`}
                className="mt-4 block text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Ver más de {place.municipality.name} →
              </Link>
            </div>

            {/* Volver */}
            <Link
              href="/lugares"
              className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors"
            >
              ← Volver a lugares
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}