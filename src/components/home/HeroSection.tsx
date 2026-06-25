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

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
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
    <section className="relative h-screen flex items-center justify-center overflow-hidden" style={{ marginTop: "-80px" }}>

      {/* Foto de Barichara */}
      {/* Fondo verde oscuro */}
<div
  className="absolute inset-0"
  style={{ backgroundColor: "#1a3d2b" }}
/>

      {/* Degradado negro hacia abajo */}
<div
  className="absolute inset-0"
  style={{
    background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, #0a0a0a 100%)"
  }}
/>
      {/* Partículas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs font-medium px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
          Colombia · Santander
        </div>

        {/* Título */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-none tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}>
          Descubre lo
          <br />
          <span style={{
            background: "linear-gradient(to right, #6ee7b7, #2dd4bf)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            extraordinario
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-white/65 text-base md:text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed">
          Cascadas escondidas, pueblos coloniales y aventuras únicas en el corazón de Colombia
        </p>

        {/* Buscador */}
        <div className="flex max-w-xl mx-auto mb-10 bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="flex-1 relative">
            <Search style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "16px",
              height: "16px",
              color: "#9ca3af"
            }} />
            <input
              type="text"
              placeholder="Busca un destino o municipio..."
              style={{
                width: "100%",
                paddingLeft: "44px",
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
              padding: "14px 24px",
              fontSize: "14px",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#16a34a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#15803d")}
          >
            Explorar
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { num: "87", label: "Municipios" },
            { num: "+200", label: "Destinos" },
            { num: "+50", label: "Alojamientos" },
            { num: "+30", label: "Restaurantes" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.num}</div>
              <div className="text-white/45 text-xs uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
        <ArrowDown className="w-5 h-5" />
      </div>
    </section>
  )
}