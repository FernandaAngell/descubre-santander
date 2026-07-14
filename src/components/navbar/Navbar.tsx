"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import Logo from "./Logo"
import NavLinks from "./NavLinks"
import UserMenu from "./UserMenu"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    onScroll()

    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`
        fixed
        inset-x-0
        top-0
        z-50
        transition-all
        duration-500

        ${
          scrolled
            ? "bg-black/75 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }
      `}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">

        <Logo />

        <NavLinks />

        <div className="hidden lg:block">
          <UserMenu />
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-white lg:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>

      </div>

      {open && (

        <div className="border-t border-white/10 bg-black/95 backdrop-blur-xl lg:hidden">

          <div className="space-y-8 px-8 py-8">

            <NavLinks />

            <UserMenu />

          </div>

        </div>

      )}

    </header>
  )
}