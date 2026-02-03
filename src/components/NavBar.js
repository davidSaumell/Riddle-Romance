'use client'

import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/">Home</Link>
      <Link href="/games">Juegos</Link>
    </nav>
  )
}
