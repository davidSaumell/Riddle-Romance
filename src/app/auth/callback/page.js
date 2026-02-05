"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabaseClient"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleAuth = async () => {
      // Esta función activa la sesión si el magic link contiene el token
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error obteniendo sesión:", error.message)
        router.push("/") // fallback a landing
        return
      }

      if (data.session) {
        router.push("/dashboard")
      } else {
        router.push("/")
      }

      setLoading(false)
    }

    handleAuth()
  }, [])

  return (
    <section className="container">
      <p>{loading ? "Validando sesión..." : "Redirigiendo..."}</p>
    </section>
  )
}
