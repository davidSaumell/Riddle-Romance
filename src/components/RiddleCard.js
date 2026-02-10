"use client"

import { useState } from "react"

export default function RiddleCard({ card, isUnlocked, unlock, justUnlocked }) {
  const [answer, setAnswer] = useState("")
  const [errorAnim, setErrorAnim] = useState(false)

  if (isUnlocked) return null

  const checkAnswer = () => {
    if (answer.trim().toLowerCase() === card.answer.toLowerCase()) {
      unlock(card.id)
    }
    else {
      setErrorAnim(true)
      setTimeout(() => setErrorAnim(false), 450)
      return
    }
  }

  return (
    <div className={`game-card ${justUnlocked ? "unlock-anim" : ""}`}>
      <h3>{card.question}</h3>

      <input
        className={`riddle-input ${errorAnim ? "riddle-error" : ""}`}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="La teva resposta..."
      />

      <button onClick={checkAnswer}>Comprobar</button>
    </div>
  )
}
