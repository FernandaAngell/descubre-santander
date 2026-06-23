import { prisma } from "@/lib/prisma"
import { MapPin, Building, UtensilsCrossed, Users } from "lucide-react"

export default async function AdminPage() {
  const [places, accommodations, restaurants, users] = await Promise.all([
    prisma.place.count(),
    prisma.accommodation.count(),
    prisma.restaurant.count(),
    prisma.user.count(),
  ])

  const stats = [
    { label: "Lugares", value: places, icon: MapPin, color: "text-emerald-600 bg-emerald-100" },
    { label: "Alojamientos", value: accommodations, icon: Building, color: "text-purple-600 bg-purple-100" },
    { label: "Restaurantes", value: restaurants, icon: UtensilsCrossed, color: "text-orange-600 bg-orange-100" },
    { label: "Usuarios", value: users, icon: Users, color: "text-blue-600 bg-blue-100" },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Resumen general de la plataforma</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/admin/lugares/nuevo"
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-6 transition-colors"
        >
          <MapPin className="w-8 h-8 mb-3" />
          <div className="font-bold text-lg">Agregar lugar</div>
          <div className="text-emerald-200 text-sm mt-1">Crear nuevo lugar turístico</div>
        </a>
        <a href="/admin/alojamientos/nuevo"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl p-6 transition-colors"
        >
          <Building className="w-8 h-8 mb-3" />
          <div className="font-bold text-lg">Agregar alojamiento</div>
          <div className="text-purple-200 text-sm mt-1">Crear nuevo alojamiento</div>
        </a>
        <a href="/admin/restaurantes/nuevo"
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl p-6 transition-colors"
        >
          <UtensilsCrossed className="w-8 h-8 mb-3" />
          <div className="font-bold text-lg">Agregar restaurante</div>
          <div className="text-orange-200 text-sm mt-1">Crear nuevo restaurante</div>
        </a>
      </div>
    </div>
  )
}