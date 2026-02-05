"use client"

import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  const handleStart = () => {
    router.push("/login")
  }

  return (
    <section className="container">
      <h1>Riddle Romance 💛</h1>
      <p>
        Bienvenido a tu web de acertijos y minijuegos para parejas.
        Completa los retos y desbloquea tickets canjeables.
      </p>

      <button onClick={handleStart} className="start-button">
        Empezar
      </button>
    </section>
  )
}
