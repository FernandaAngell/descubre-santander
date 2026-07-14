import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import LoginButton from "@/components/auth/LoginButton"
import { MapPin, Check } from "lucide-react"

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect("/")

  return (
    <div 
      className="bg-[#0a0f0c] min-h-screen flex items-center justify-center pt-24 pb-12 md:py-20"
      style={{
        backgroundImage: "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(21,128,61,0.25) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 100% 60%, rgba(21,128,61,0.1) 0%, transparent 60%)",
      }}
    >
      {/* Grid: 1 columna en móvil para que no se amontone, 2 columnas en desktop */}
      <div className="w-full max-w-[1152px] mx-auto px-6 sm:px-8 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-[72px] items-center">

        {/* Foto del cañón: Oculta en móviles (hidden), visible a partir de pantallas medianas (md:block) */}
        <div className="hidden md:block w-full rounded-2xl overflow-hidden aspect-[0.72] relative shadow-2xl border border-white/5">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://res.cloudinary.com/dxalbznya/image/upload/v1782403498/ca%C3%B1on_ejyedw.jpg')",
            }} 
          />
        </div>

        {/* Contenido/Formulario: Centrado en móviles (max-w-md mx-auto) */}
        <div className="w-full max-w-md mx-auto md:max-w-none flex flex-col justify-center">
          <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-[0_0_40px_rgba(74,222,128,0.35)]">
            <MapPin size={22} color="white" />
          </div>

          <h1 
            style={{
              fontFamily: "var(--font-display)",
              lineHeight: 1.05,
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#f5f0e8] mb-6 tracking-tight"
          >
            Haz tu viaje<br />más tuyo
          </h1>

          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-[440px]">
            Inicia sesión para descubrir lo mejor de Santander
            y vivir experiencias únicas.
          </p>

          {/* Beneficios */}
          <div className="flex flex-col gap-4 md:gap-5 mb-8 md:mb-10">
            {[
              "Guarda tus lugares favoritos",
              "Comparte reseñas reales",
              "Encuentra experiencias para ti",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-4">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-[#4ade80]" strokeWidth={3} />
                </div>
                <span className="text-white/80 text-sm md:text-base font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Botón Google */}
          <div className="w-full">
            <LoginButton />
          </div>

          <p className="text-white/35 text-xs md:text-sm mt-6 md:mt-8 leading-relaxed">
            Al continuar, aceptas nuestros{" "}
            <span className="text-emerald-400 hover:underline cursor-pointer">Términos de uso</span>
            <br />
            y nuestra{" "}
            <span className="text-emerald-400 hover:underline cursor-pointer">Política de privacidad</span>.
          </p>
        </div>
      </div>
    </div>
  )
}