"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export default function useCardUnlock(gameId, playerId) {
  const [unlockedCards, setUnlockedCards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!playerId || !gameId) return

    let isMounted = true

    const fetchUnlocked = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from("unlocked_cards")
        .select("card_id")
        .eq("player_id", playerId)

      if (error) {
        console.error("Error cargando progreso:", error.message)
        if (isMounted) setUnlockedCards([])
      } else {
        if (isMounted) {
          setUnlockedCards(data.map((c) => c.card_id))
        }
      }

      if (isMounted) setLoading(false)
    }

    fetchUnlocked()

    return () => {
      isMounted = false
    }
  }, [playerId, gameId])

  const unlockCard = async (cardId) => {
    if (!playerId) return
    if (unlockedCards.includes(cardId)) return

    const { error } = await supabase
      .from("unlocked_cards")
      .insert([
        {
          player_id: playerId,
          card_id: cardId,
        },
      ])

    if (error) {
      console.error("Error desbloqueando carta:", error.message)
      return
    }

    setUnlockedCards((prev) => [...prev, cardId])
  }

  const isUnlocked = (cardId) => unlockedCards.includes(cardId)

  return {
    unlockedCards,
    isUnlocked,
    unlockCard,
    loading,
  }
}
