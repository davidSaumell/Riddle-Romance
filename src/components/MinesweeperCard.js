"use client"

import { useState } from "react"
import GameCard from "./GameCard"

export default function MinesweeperCard({ card }) {
  const [completed, setCompleted] = useState(false)

  return (
    <GameCard flipped={completed} status={completed ? "completed" : "active"}>
      <>
        <div className="card-front">
          <h3>💣 Buscaminas</h3>

          <p>
            Evita las minas y completa el tablero.
          </p>

          <button onClick={() => setCompleted(true)}>
            Marcar como completado
          </button>
        </div>

        <div className="card-back">
          🎁 {card.reward}
        </div>
      </>
    </GameCard>
  )
}
