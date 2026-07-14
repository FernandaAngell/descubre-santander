"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Heart, LogOut, Settings, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"

export default function UserMenu() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  if (!session) {
    return (
      <Link
        href="/auth/login"
        className="
          rounded-full
          bg-emerald-600
          px-6
          py-3
          text-sm
          font-semibold
          text-white
          transition-all
          duration-300
          hover:bg-emerald-500
          hover:shadow-xl
          hover:shadow-emerald-500/20
        "
      >
        Iniciar sesión
      </Link>
    )
  }

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          items-center
          gap-3
          rounded-full
          border
          border-white/10
          bg-white/5
          px-4
          py-2
          backdrop-blur-md
          transition
          hover:bg-white/10
        "
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt=""
            width={34}
            height={34}
            className="rounded-full"
          />
        ) : (
          <User className="h-5 w-5 text-white" />
        )}

        <span className="text-sm font-medium text-white">
          {session.user?.name?.split(" ")[0]}
        </span>

        <ChevronDown className="h-4 w-4 text-white/60" />
      </button>

      {open && (

        <div
          className="
            absolute
            right-0
            mt-4
            w-64
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-[#101010]
            shadow-2xl
          "
        >

          <div className="border-b border-white/10 p-5">

            <p className="font-semibold text-white">
              {session.user?.name}
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              {session.user?.email}
            </p>

          </div>

          <Link
            href="/favoritos"
            className="flex items-center gap-3 px-5 py-4 text-zinc-300 transition hover:bg-white/5"
          >
            <Heart className="h-4 w-4" />
            Favoritos
          </Link>

          {session.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-5 py-4 text-zinc-300 transition hover:bg-white/5"
            >
              <Settings className="h-4 w-4" />
              Panel administrador
            </Link>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 px-5 py-4 text-left text-red-400 transition hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>

        </div>

      )}

    </div>
  )
}