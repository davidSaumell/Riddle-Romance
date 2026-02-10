"use client"

import { useState } from "react"

export default function RiddleCard({ card, isUnlocked, unlock }) {
  const [answer, setAnswer] = useState("")

  if (isUnlocked) return null

  const checkAnswer = () => {
    if (answer.trim().toLowerCase() === card.answer.toLowerCase()) {
      unlock(card.id)
    }
  }

  return (
    <div className="game-card">
      <h3>{card.question}</h3>

      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="La teva resposta..."
      />

      <button onClick={checkAnswer}>Comprobar</button>
    </div>
  )
}
