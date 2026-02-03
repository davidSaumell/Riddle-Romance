"use client"
import { useState } from "react"

export default function RiddleCard({ card, onSolved }) {
  const [answer, setAnswer] = useState("")
  const [error, setError] = useState(false)

  const checkAnswer = () => {
    if (answer.toLowerCase() === card.answer.toLowerCase()) {
      onSolved()
    } else {
      setError(true)
    }
  }

  return (
    <>
      <h3>Endevinalla</h3>
      <p>{card.question}</p>

      <input
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Tu respuesta"
      />

      <button onClick={checkAnswer}>Comprobar</button>

      {error && <p className="error">Respuesta incorrecta</p>}
    </>
  )
}
