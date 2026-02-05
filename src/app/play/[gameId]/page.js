"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

import GameCard from "@/components/GameCard"
import RiddleCard from "@/components/RiddleCard"
import MinesweeperCard from "@/components/MinesweeperCard"
import SudokuCard from "@/components/SudokuCard"


export default function PlayPage({ params }) {
  const { gameId } = params

  const [loading, setLoading] = useState(true)
  const [game, setGame] = useState(null)
  const [cards, setCards] = useState([])

  useEffect(() => {
    const init = async () => {
      // Auth (anónimo si hace falta)
      let {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) {
          console.error("Auth error:", error)
          return
        }
        user = data.user
      }

      // Cargar game
      const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single()

      if (gameError) {
        console.error("Error cargando game:", gameError.message)
        return
      }

      setGame(gameData)

      // Cargar cards
      const { data: cardsData, error: cardsError } = await supabase
        .from("cards")
        .select("*")
        .eq("game_id", gameId)
        .order("created_at")

      if (cardsError) {
        console.error("Error cargando cards:", cardsError.message)
        return
      }

      setCards(cardsData)
      setLoading(false)
    }

    init()
  }, [gameId])

  if (loading) return <p>Cargando juego...</p>

  if (!game) return <p>Juego no encontrado</p>

  return (
    <section>
      <h1>{game.title}</h1>

      <div className="cards-grid">
        {cards.map((card) => {
          switch (card.type) {
            case "riddle":
              return <RiddleCard key={card.id} card={card} />

            case "minesweeper":
              return <MinesweeperCard key={card.id} card={card} />

            case "sudoku":
              return <SudokuCard key={card.id} card={card} />

            default:
              return <GameCard key={card.id} card={card} />
          }
        })}
      </div>
    </section>
  )
}
