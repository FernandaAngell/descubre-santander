"use client"

import Link from "next/link"

const links = [
  {
    href: "/lugares",
    label: "Lugares",
  },
  {
    href: "/alojamientos",
    label: "Alojamientos",
  },
  {
    href: "/restaurantes",
    label: "Restaurantes",
  },
  {
    href: "/municipios",
    label: "Municipios",
  },
]

export default function NavLinks() {
  return (
    <div className="hidden lg:flex items-center gap-12">

      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="
            relative
            text-[15px]
            font-medium
            text-white/75
            transition-all
            duration-300

            hover:text-white

            after:absolute
            after:left-0
            after:-bottom-2
            after:h-[2px]
            after:w-0
            after:bg-emerald-400
            after:transition-all
            after:duration-300

            hover:after:w-full
          "
        >
          {link.label}
        </Link>
      ))}

    </div>
  )
}