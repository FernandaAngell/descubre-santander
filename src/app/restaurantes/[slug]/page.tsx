import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { MapPin, Star, Clock, Phone } from "lucide-react"
import Link from "next/link"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function RestauranteDetailPage({ params }: Props) {
  const { slug } = await params

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      municipality: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!restaurant || restaurant.status !== "PUBLISHED") {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="h-72 md:h-96 bg-gradient-to-br from-orange-500 to-red-700 relative flex items-end">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-9xl opacity-20">🍽️</span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-8 w-full">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">
              {restaurant.foodType}
            </span>
            {restaurant.rating > 0 && (
              <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-yellow-400 text-yellow-900">
                <Star className="w-3 h-3 fill-yellow-900" />
                {restaurant.rating.toFixed(1)}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {restaurant.name}
          </h1>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <span>{restaurant.municipality.name}, Santander</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Contenido principal */}
          <div className="flex-1">

            {/* Info rápida */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Precio promedio</div>
                <div className="text-sm font-semibold text-gray-900">
                  ${restaurant.priceAvg.toLocaleString("es-CO")} por persona
                </div>
              </div>
              {restaurant.schedule && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Horario</div>
                  <div className="text-sm font-semibold text-gray-900">{restaurant.schedule}</div>
                </div>
              )}
              {restaurant.address && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Dirección</div>
                  <div className="text-sm font-semibold text-gray-900 line-clamp-2">{restaurant.address}</div>
                </div>
              )}
            </div>

            {/* Descripción */}
            {restaurant.description && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre este restaurante</h2>
                <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
              </div>
            )}

            {/* Especialidades */}
            {restaurant.specialties.length > 0 && (
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Especialidades</h2>
                <div className="flex flex-wrap gap-2">
                  {restaurant.specialties.map((s, i) => (
                    <span key={i} className="bg-white text-orange-700 border border-orange-200 text-sm font-medium px-4 py-2 rounded-xl">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reseñas */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Reseñas {restaurant.reviews.length > 0 && `(${restaurant.reviews.length})`}
              </h2>
              {restaurant.reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-3">💬</div>
                  <p>Aún no hay reseñas. ¡Sé el primero!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {restaurant.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-semibold text-sm">
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

            {/* Contacto */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Información de contacto</h3>

              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="w-full flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-xl transition-colors mb-3"
                >
                  <Phone className="w-4 h-4" />
                  {restaurant.phone}
                </a>
              )}

              {restaurant.schedule && (
                <div className="flex items-start gap-3 text-sm text-gray-600 mt-3">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                  <span>{restaurant.schedule}</span>
                </div>
              )}

              {restaurant.address && (
                <div className="flex items-start gap-3 text-sm text-gray-600 mt-3">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                  <span>{restaurant.address}</span>
                </div>
              )}
            </div>

            {/* Municipio */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Municipio</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{restaurant.municipality.name}</div>
                  {restaurant.municipality.weather && (
                    <div className="text-xs text-gray-500">{restaurant.municipality.weather}</div>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/restaurantes"
              className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors"
            >
              ← Volver a restaurantes
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}