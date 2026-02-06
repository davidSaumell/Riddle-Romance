"use client"

import { useState } from "react"

export default function MinesweeperCard({ card, isUnlocked, unlock }) {
  const [clicked, setClicked] = useState(false)

  if (isUnlocked) return null

  const handleClick = () => {
    setClicked(true)
    unlock(card.id)
  }

  return (
    <div className="game-card">
      <h3>{card.title}</h3>
      <p>{card.description}</p>

      <button onClick={handleClick} disabled={clicked}>
        {clicked ? "Completado" : "Descubrir casilla"}
      </button>
    </div>
  )
}
