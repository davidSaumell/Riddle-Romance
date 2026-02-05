"use client"

import { useState } from "react"
import GameCard from "./GameCard"

export default function RiddleCard({ card }) {
  const [answer, setAnswer] = useState("")
  const [completed, setCompleted] = useState(false)

  const checkAnswer = () => {
    if (answer.toLowerCase().trim() === card.answer.toLowerCase()) {
      setCompleted(true)
    }
  }

  return (
    <GameCard flipped={completed} status={completed ? "completed" : "active"}>
      <>
        <div className="card-front">
          <h3>{card.question}</h3>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Tu respuesta..."
          />
          <button onClick={checkAnswer}>Comprobar</button>
        </div>

        <div className="card-back">
          🎁 {card.reward}
        </div>
      </>
    </GameCard>
  )
}
