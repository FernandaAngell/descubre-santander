import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { placeId } = await req.json()

  if (!placeId) {
    return NextResponse.json({ error: "placeId requerido" }, { status: 400 })
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_placeId: {
        userId: session.user.id,
        placeId,
      },
    },
  })

  if (existing) {
    await prisma.favorite.delete({
      where: { id: existing.id },
    })
    return NextResponse.json({ favorited: false })
  }

  await prisma.favorite.create({
    data: {
      userId: session.user.id,
      placeId,
    },
  })

  return NextResponse.json({ favorited: true })
}

export async function GET(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      place: {
        include: { municipality: true, category: true },
      },
    },
  })

  return NextResponse.json(favorites)
}