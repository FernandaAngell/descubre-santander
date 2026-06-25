"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Search, ArrowDown } from "lucide-react"

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = []

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    let animId: number
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.fill()
      })
      animId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20">

      {/* Fondo con imagen de Barichara */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1733153453347-f80cf175fca5?w=1920&q=80')",
        }}
      />

      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/75" />

      {/* Partículas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
          Colombia • Santander
        </div>

        {/* Título */}
        <h1 className="font-display text-6xl md:text-8xl font-bold text-white mb-6 leading-none tracking-tight">
          Descubre lo
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
            extraordinario
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Cascadas escondidas, pueblos coloniales y aventuras únicas en el corazón de Colombia
        </p>

        {/* Buscador */}
<div style={{
  display: "flex",
  maxWidth: "600px",
  margin: "0 auto 4rem",
  background: "white",
  borderRadius: "16px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
  overflow: "hidden",
}}>
  <div style={{ flex: 1, position: "relative" }}>
    <Search style={{
      position: "absolute",
      left: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "18px",
      height: "18px",
      color: "#9ca3af"
    }} />
    <input
      type="text"
      placeholder="Busca un destino, municipio o experiencia..."
      style={{
        width: "100%",
        paddingLeft: "52px",
        paddingRight: "16px",
        paddingTop: "14px",
        paddingBottom: "14px",
        fontSize: "14px",
        color: "#1f2937",
        border: "none",
        outline: "none",
        background: "transparent",
      }}
    />
  </div>
  <Link
    href="/lugares"
    style={{
      background: "#15803d",
      color: "white",
      fontWeight: "600",
      padding: "14px 28px",
      fontSize: "14px",
      whiteSpace: "nowrap",
      transition: "background 0.2s",
      display: "flex",
      alignItems: "center",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#16a34a")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "#15803d")}
  >
    Explorar
  </Link>
</div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10">
          {[
            { num: "87", label: "Municipios" },
            { num: "+200", label: "Destinos" },
            { num: "+50", label: "Alojamientos" },
            { num: "+30", label: "Restaurantes" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white">{stat.num}</div>
              <div className="text-white/50 text-xs uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce">
        <ArrowDown className="w-5 h-5" />
      </div>
    </section>
  )
}