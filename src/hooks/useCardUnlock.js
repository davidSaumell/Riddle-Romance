"use client"
import { useState, useEffect } from "react"

const STORAGE_KEY = "unlockedCards"

export default function useCardUnlock(initialCards = []) {
  const [unlockedCards, setUnlockedCards] = useState([])

  // Cargar desde localStorage al inicio
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setUnlockedCards(JSON.parse(stored))
    }
  }, [])

  // Guardar en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedCards))
  }, [unlockedCards])

  // Función para desbloquear una tarjeta
  const unlockCard = (id) => {
    if (!unlockedCards.includes(id)) {
      setUnlockedCards([...unlockedCards, id])
    }
  }

  // Comprobar si una tarjeta está desbloqueada
  const isUnlocked = (id) => unlockedCards.includes(id)

  return { unlockedCards, unlockCard, isUnlocked }
}
