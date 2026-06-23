import Link from "next/link"
import { LayoutDashboard, MapPin, Building, UtensilsCrossed, LogOut } from "lucide-react"

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/lugares", label: "Lugares", icon: MapPin },
  { href: "/admin/alojamientos", label: "Alojamientos", icon: Building },
  { href: "/admin/restaurantes", label: "Restaurantes", icon: UtensilsCrossed },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ paddingTop: 0 }}>

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shrink-0 fixed top-0 left-0 h-full z-50">
        <div className="p-6 border-b border-gray-700">
          <Link href="/" className="text-emerald-400 font-bold text-lg">
            Descubre Santander
          </Link>
          <div className="text-gray-400 text-xs mt-1">Panel admin</div>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm font-medium"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Contenido */}
      <main className="ml-64 flex-1 p-8 pt-8">
        {children}
      </main>
    </div>
  )
}