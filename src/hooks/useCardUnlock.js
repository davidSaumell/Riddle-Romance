"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export default function useCardUnlock(gameId, playerId) {
  const [unlockedCards, setUnlockedCards] = useState([])

  useEffect(() => {
    if (!playerId) return

    const fetchUnlocked = async () => {
      const { data, error } = await supabase
        .from("unlocked_cards")
        .select("card_id")
        .eq("player_id", playerId)
      if (!error) setUnlockedCards(data.map(c => c.card_id))
    }

    fetchUnlocked()
  }, [playerId])

  const unlockCard = async (cardId) => {
    if (unlockedCards.includes(cardId)) return

    const { error } = await supabase
      .from("unlocked_cards")
      .insert([{ player_id: playerId, card_id: cardId }])

    if (!error) setUnlockedCards(prev => [...prev, cardId])
  }

  const isUnlocked = (cardId) => unlockedCards.includes(cardId)

  return { unlockCard, isUnlocked }
}
