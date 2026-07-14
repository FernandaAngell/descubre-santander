import Link from "next/link"
import { MapPin } from "lucide-react"

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 transition-opacity hover:opacity-90"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 shadow-lg shadow-emerald-600/25">
        <MapPin className="h-5 w-5 text-white" />
      </div>

      <div className="flex flex-col leading-none">
        <span className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-white">
          Descubre
        </span>

        <span className="-mt-1 text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">
          Santander
        </span>
      </div>
    </Link>
  )
}