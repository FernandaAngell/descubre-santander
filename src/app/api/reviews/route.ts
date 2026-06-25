import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { rating, comment, placeId, accommodationId, restaurantId } = await req.json()

  if (!rating || !comment) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 })
  }

  const review = await prisma.review.create({
    data: {
      rating,
      comment,
      photos: [],
      userId: session.user.id,
      placeId: placeId || null,
      accommodationId: accommodationId || null,
      restaurantId: restaurantId || null,
    },
  })

  return NextResponse.json(review)
}