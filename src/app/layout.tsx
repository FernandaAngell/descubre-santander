import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import AuthProvider from "@/components/auth/AuthProvider"
import { headers } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Descubre Santander — Turismo en Santander, Colombia",
  description: "Descubre los mejores lugares turísticos, alojamientos, restaurantes y experiencias en el departamento de Santander, Colombia.",
  keywords: "Santander, Colombia, turismo, Barichara, San Gil, Bucaramanga, viajes",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get("x-invoke-path") || ""
  const isAdmin = pathname.startsWith("/admin")

  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {!isAdmin && <Navbar />}
          <main className={isAdmin ? "" : "pt-16"}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}