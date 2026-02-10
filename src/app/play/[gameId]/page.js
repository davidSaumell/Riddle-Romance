"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

import GameCardRouter from "@/components/GameCardRouter"
import TicketCard from "@/components/TicketCard"
import useCardUnlock from "@/hooks/useCardUnlock"

export default function PlayPage({ params }) {
  const { gameId } = params

  const [loadingGame, setLoadingGame] = useState(true)
  const [game, setGame] = useState(null)
  const [cards, setCards] = useState([])
  const [playerId, setPlayerId] = useState(null)

  // Hook que maneja cartas desbloqueadas en Supabase
  const { unlockedCards, unlockCard, loading: loadingProgress } =
    useCardUnlock(gameId, playerId)

  // Inicialización: auth + juego + jugador
  useEffect(() => {
    const init = async () => {
      // Auth (anónimo si hace falta)
      let {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) {
          console.error("Auth error:", error.message)
          return
        }
        user = data.user
      }

      // Crear o recuperar jugador
      let { data: existingPlayer, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("game_id", gameId)
        .eq("id", user.id) // suponiendo player.id = auth.user.id
        .single()

      if (!existingPlayer) {
        const { data: newPlayer, error: insertError } = await supabase
          .from("players")
          .insert([
            {
              id: user.id, // usamos id de Supabase auth
              game_id: gameId,
              name: "Jugador",
            },
          ])
          .select()
          .single()

        if (insertError) {
          console.error("Error creando jugador:", insertError.message)
          return
        }

        setPlayerId(newPlayer.id)
      } else {
        setPlayerId(existingPlayer.id)
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
        .order("position", { ascending: true })

      if (cardsError) {
        console.error("Error cargando cards:", cardsError.message)
        return
      }

      setCards(cardsData)
      setLoadingGame(false)
    }

    init()
  }, [gameId])

  if (loadingGame || loadingProgress) return <p>Cargando juego...</p> //TODO: Afegir un spiner

  if (!game) return <p>Juego no encontrado</p>

  return (
    <>
      <header className="play-intro">
        <h1>Desbloqueja la nostra aventura</h1>

        <p>
          Devant teu trobaràs una serie de cartes ocultes amb jocs y reptes.
          Supera cada repte per desbloquejar recompenses especials pensades per disfrutar en parella.
        </p>

        <div className="play-intro-actions">
          <div>🃏 Completa una carta per començar</div>
          <div>🎁 Conseguex tiquets amb sorpreses úniques</div>
        </div>
      </header>

      <section>
        <h1>{game.title}</h1>

        <h2>Juegos</h2>
        <div className="cards-grid">
          {cards.map(card => {
            console.log(card)
          })}

          {cards.map((card) => (
            <GameCardRouter
              key={card.id}
              card={card}
              isUnlocked={unlockedCards.includes(card.id)}
              unlock={() => unlockCard(card.id)}
            />
          ))}
        </div>

        <h2>Tus tickets</h2>
        <div className="tickets-grid">
          {cards
            .filter((c) => unlockedCards.includes(c.id))
            .map((card) => (
              <TicketCard key={card.id} card={card} />
            ))}
        </div>
      </section>
    </>
  )
}
