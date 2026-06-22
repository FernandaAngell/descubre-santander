import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import LoginButton from "@/components/auth/LoginButton"
import { MapPin } from "lucide-react"

export default async function LoginPage() {
  const session = await auth()

  if (session) redirect("/")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            <MapPin className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Descubre Santander</h1>
          <p className="text-gray-500 mt-2">Inicia sesión para guardar favoritos y dejar reseñas</p>
        </div>

        {/* Beneficios */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs">✓</span>
              Guarda tus lugares favoritos
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs">✓</span>
              Deja reseñas y calificaciones
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs">✓</span>
              Accede al panel de administración
            </li>
          </ul>
        </div>

        {/* Botón Google */}
        <LoginButton />

        <p className="text-center text-xs text-gray-400 mt-6">
          Al iniciar sesión aceptas nuestros términos de uso y política de privacidad
        </p>
      </div>
    </div>
  )
}