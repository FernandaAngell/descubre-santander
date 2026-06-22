import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      })

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: "USER",
          },
        })
      }

      return true
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, role: true },
        })
        if (dbUser) {
          session.user.id = dbUser.id
          session.user.role = dbUser.role
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
})