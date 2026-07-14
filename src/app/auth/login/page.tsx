import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import LoginButton from "@/components/auth/LoginButton"
import { MapPin, Check } from "lucide-react"

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect("/")

  return (
    <div style={{
      backgroundColor: "#0a0f0c",
      minHeight: "100vh",
      paddingTop: "80px",
      backgroundImage: "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(21,128,61,0.25) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 100% 60%, rgba(21,128,61,0.1) 0%, transparent 60%)",
    }}>
      <div style={{
        maxWidth: "1152px", margin: "0 auto",
        padding: "40px 24px 100px",
        display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "72px",
        alignItems: "center",
      }}>

        {/* Foto del cañón */}
        <div style={{
          borderRadius: "18px", overflow: "hidden",
          aspectRatio: "0.72", position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('https://res.cloudinary.com/dxalbznya/image/upload/v1782403498/ca%C3%B1on_ejyedw.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
        </div>

        {/* Contenido */}
        <div>
          <div style={{
            width: "52px", height: "52px",
            background: "#15803d", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "36px",
            boxShadow: "0 0 40px rgba(74,222,128,0.35)",
          }}>
            <MapPin size={24} color="white" />
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(44px, 5.5vw, 72px)",
            fontWeight: 600, color: "#f5f0e8",
            margin: "0 0 24px", lineHeight: 1.05,
          }}>
            Haz tu viaje<br />más tuyo
          </h1>

          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "17px", lineHeight: 1.6, margin: "0 0 40px", maxWidth: "440px" }}>
            Inicia sesión para descubrir lo mejor de Santander
            y vivir experiencias únicas.
          </p>

          {/* Beneficios */}
          <div style={{ display: "flex", flexDirection: "column", gap: "22px", marginBottom: "44px" }}>
            {[
              "Guarda tus lugares favoritos",
              "Comparte reseñas reales",
              "Encuentra experiencias para ti",
            ].map((benefit) => (
              <div key={benefit} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "40px", height: "40px",
                  background: "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.25)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Check size={16} color="#4ade80" strokeWidth={3} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px" }}>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Botón Google */}
          <div style={{ maxWidth: "450px" }}>
            <LoginButton />
          </div>

          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", marginTop: "24px", lineHeight: 1.6 }}>
            Al continuar, aceptas nuestros{" "}
            <span style={{ color: "#4ade80" }}>Términos de uso</span>
            <br />
            y nuestra{" "}
            <span style={{ color: "#4ade80" }}>Política de privacidad</span>.
          </p>
        </div>
      </div>
    </div>
  )
}