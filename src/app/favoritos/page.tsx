import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MapPin, Heart } from "lucide-react"

export default async function FavoritosPage() {
  const session = await auth()

  if (!session?.user?.id) redirect("/auth/login")

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      place: {
        include: { municipality: true, category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 fill-white" />
            <h1 className="text-4xl md:text-5xl font-bold">Mis favoritos</h1>
          </div>
          <p className="text-red-200 text-lg">
            {favorites.length} {favorites.length === 1 ? "lugar guardado" : "lugares guardados"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aún no tienes favoritos
            </h3>
            <p className="text-gray-500 mb-6">
              Explora los lugares y guarda los que más te gusten
            </p>
            <Link
              href="/lugares"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3 rounded-xl transition-colors"
            >
              Explorar lugares
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <Link
                key={fav.id}
                href={`/lugares/${fav.place.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-44 bg-gradient-to-br from-emerald-400 to-teal-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-30">{fav.place.category.icon}</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: fav.place.category.color }}
                    >
                      {fav.place.category.name}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-emerald-600 transition-colors">
                    {fav.place.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{fav.place.municipality.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}