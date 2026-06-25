import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import AuthProvider from "@/components/auth/AuthProvider"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Descubre Santander — Turismo en Santander, Colombia",
  description: "Descubre los mejores lugares turísticos, alojamientos, restaurantes y experiencias en el departamento de Santander, Colombia.",
  keywords: "Santander, Colombia, turismo, Barichara, San Gil, Bucaramanga, viajes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} ${playfair.variable}`}
        style={{ backgroundColor: "#ffffff", margin: 0, padding: 0 }}
      >
        <AuthProvider>
          <Navbar />
          <main style={{ backgroundColor: "#ffffff" }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}