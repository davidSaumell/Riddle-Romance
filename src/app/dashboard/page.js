"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [games, setGames] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("created_at", { ascending: false })
      if (!error) setGames(data)
    }

    fetchGames()
  }, [])

  return (
    <section className="container">
      <h2>Mis Juegos</h2>
      <button onClick={() => router.push("/create-game")}>Crear nuevo juego</button>
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </section>
  )
}
