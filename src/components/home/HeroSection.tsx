import Link from "next/link"
import { Search, MapPin } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden">

      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6">
          <MapPin className="w-4 h-4" />
          <span>Santander, Colombia</span>
        </div>

        {/* Título */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Descubre la magia de{" "}
          <span className="text-emerald-300">Santander</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Cascadas, pueblos coloniales, aventura extrema y gastronomía única.
          Todo lo que necesitas para tu próximo viaje.
        </p>

        {/* Buscador */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="¿Qué quieres descubrir?"
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base"
            />
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-colors duration-200 whitespace-nowrap">
            Buscar
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-white/70">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">87</div>
            <div className="text-sm">Municipios</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">+200</div>
            <div className="text-sm">Lugares</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">+50</div>
            <div className="text-sm">Alojamientos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">+30</div>
            <div className="text-sm">Restaurantes</div>
          </div>
        </div>
      </div>
    </section>
  )
}