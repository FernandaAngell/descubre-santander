import Link from "next/link"
import { Category } from "@prisma/client"

interface Props {
  categories: Category[]
}

export default function CategoriesSection({ categories }: Props) {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Qué quieres explorar?
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Encuentra experiencias únicas según tus intereses
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/lugares?categoria=${category.slug}`}
              className="group flex flex-col items-center gap-3 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 hover:border-emerald-200 transition-all duration-200 hover:-translate-y-1"
            >
              <span className="text-4xl">{category.icon}</span>
              <span className="font-medium text-gray-700 group-hover:text-emerald-600 text-sm text-center transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}