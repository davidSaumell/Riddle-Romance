'use client'

import Link from "next/link"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/">Home</Link>
      <Link href="/games">Juegos</Link>
      <ThemeToggle />
    </nav>
  )
}
