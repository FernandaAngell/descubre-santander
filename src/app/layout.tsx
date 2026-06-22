import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import AuthProvider from "@/components/auth/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}