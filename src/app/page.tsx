import { prisma } from "@/lib/prisma"
import HeroSection from "@/components/home/HeroSection"
import CategoriesSection from "@/components/home/CategoriesSection"
import FeaturedPlaces from "@/components/home/FeaturedPlaces"

export default async function Home() {
  const [featuredPlaces, categories] = await Promise.all([
    prisma.place.findMany({
      where: { status: "PUBLISHED", featured: true },
      include: { municipality: true, category: true },
      take: 6,
    }),
    prisma.category.findMany(),
  ])

  return (
    <div>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedPlaces places={featuredPlaces} />
    </div>
  )
}