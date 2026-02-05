"use client"

import { useState } from "react"
import GameCard from "./GameCard"

export default function Sudoku({ card }) {
  const [completed, setCompleted] = useState(false)

  return (
    <GameCard flipped={completed} status={completed ? "completed" : "active"}>
      <>
        <div className="card-front">
          <h3>🧩 Sudoku</h3>

          <p>
            Resuelve el sudoku para desbloquear la recompensa.
          </p>

          <button onClick={() => setCompleted(true)}>
            Marcar como completado
          </button>
        </div>

        <div className="card-back">
          🎉 {card.reward}
        </div>
      </>
    </GameCard>
  )
}
