import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { MapPin, Phone, ExternalLink } from "lucide-react"
import Link from "next/link"
import ReviewForm from "@/components/ReviewForm"

interface Props {
  params: Promise<{ slug: string }>
}

const tipoLabels: Record<string, string> = {
  GLAMPING: "Glamping",
  HOTEL: "Hotel",
  CABANA: "Cabaña",
  HOSTAL: "Hostal",
}

const idealForLabels: Record<string, string> = {
  PAREJAS: "Parejas",
  FAMILIAS: "Familias",
  GRUPOS: "Grupos",
  TODOS: "Todos",
}

const tipoColors: Record<string, string> = {
  GLAMPING: "bg-purple-100 text-purple-700",
  HOTEL: "bg-blue-100 text-blue-700",
  CABANA: "bg-amber-100 text-amber-700",
  HOSTAL: "bg-green-100 text-green-700",
}

export default async function AlojamientoDetailPage({ params }: Props) {
  const { slug } = await params

  const accommodation = await prisma.accommodation.findUnique({
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

  if (!accommodation || accommodation.status !== "PUBLISHED") {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="h-72 md:h-96 bg-gradient-to-br from-purple-600 to-indigo-800 relative flex items-end">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-9xl opacity-20">
            {accommodation.type === "GLAMPING" ? "⛺" : accommodation.type === "HOTEL" ? "🏨" : accommodation.type === "CABANA" ? "🏡" : "🛏️"}
          </span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-8 w-full">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tipoColors[accommodation.type]}`}>
              {tipoLabels[accommodation.type]}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">
              Ideal para {idealForLabels[accommodation.idealFor]}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {accommodation.name}
          </h1>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <span>{accommodation.municipality.name}, Santander</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Contenido principal */}
          <div className="flex-1">

            {/* Info rápida */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Precio por noche</div>
                <div className="text-sm font-semibold text-gray-900">
                  ${accommodation.priceMin.toLocaleString("es-CO")} — ${accommodation.priceMax.toLocaleString("es-CO")}
                </div>
              </div>
              {accommodation.capacity && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Capacidad</div>
                  <div className="text-sm font-semibold text-gray-900">Hasta {accommodation.capacity} personas</div>
                </div>
              )}
              {accommodation.checkIn && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Check-in</div>
                  <div className="text-sm font-semibold text-gray-900">{accommodation.checkIn}</div>
                </div>
              )}
              {accommodation.checkOut && (
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Check-out</div>
                  <div className="text-sm font-semibold text-gray-900">{accommodation.checkOut}</div>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre este alojamiento</h2>
              <p className="text-gray-600 leading-relaxed">{accommodation.description}</p>
            </div>

            {/* Amenidades */}
            {accommodation.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Servicios incluidos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {accommodation.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs">✓</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reseñas */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Reseñas {accommodation.reviews.length > 0 && `(${accommodation.reviews.length})`}
              </h2>
              {accommodation.reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-3">💬</div>
                  <p>Aún no hay reseñas. ¡Sé el primero!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {accommodation.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold text-sm">
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
              <div className="mt-6">
                <ReviewForm accommodationId={accommodation.id} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">

            {/* Reservar */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                Desde ${accommodation.priceMin.toLocaleString("es-CO")}
              </div>
              <div className="text-sm text-gray-500 mb-4">por noche</div>

              {accommodation.contactUrl && (
                <a
                  href={accommodation.contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
                >
                  <ExternalLink className="w-4 h-4" />
                  Contactar / Reservar
                </a>
              )}

              {accommodation.phone && (
                <a
                  href={`tel:${accommodation.phone}`}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {accommodation.phone}
                </a>
              )}
            </div>

            {/* Municipio */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Ubicación</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{accommodation.municipality.name}</div>
                  {accommodation.municipality.weather && (
                    <div className="text-xs text-gray-500">{accommodation.municipality.weather}</div>
                  )}
                </div>
              </div>
              {accommodation.address && (
                <p className="text-sm text-gray-600 mt-3">{accommodation.address}</p>
              )}
            </div>

            <Link
              href="/alojamientos"
              className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors"
            >
              ← Volver a alojamientos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}