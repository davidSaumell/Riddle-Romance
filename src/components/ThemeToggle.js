"use client"

import { useState, useEffect } from "react"

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark")
      setDark(true)
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.removeAttribute("data-theme")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Cambiar tema">
      {dark ? "☀️" : "🌙"}
    </button>
  )
}