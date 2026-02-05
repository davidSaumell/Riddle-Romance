"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert(`Revisa tu email: te hemos enviado un enlace para entrar.`)
    }
  }

  return (
    <section className="container">
      <h2>Login de Creador</h2>
      <p>Introduce tu email para recibir el enlace mágico y gestionar tus juegos.</p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Enviando..." : "Recibir enlace"}
      </button>
    </section>
  )
}
