"use client"

import { cards } from "../../data/cardsData"
import GameCard from "../../components/GameCard"
import useCardUnlock from "../../hooks/useCardUnlock"

export default function GamePage() {
  const { unlockedCards, unlockCard, isUnlocked } = useCardUnlock()

  return (
    <section className="container">
      <h2>¿Cómo funciona?</h2>
      <p>
        Completa los retos para desbloquear tickets canjeables por experiencias.
      </p>

      <div className="cards-grid">
        {cards.map(card => (
          <GameCard
            key={card.id}
            card={card}
            unlocked={isUnlocked(card.id)}
            unlock={() => unlockCard(card.id)}
          />
        ))}
      </div>
    </section>
  )
}
