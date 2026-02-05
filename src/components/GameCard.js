"use client"

export default function GameCard({ children, flipped = false, status = "active" }) {
  return (
    <div className={`card ${status} ${flipped ? "flipped" : ""}`}>
      <div className="card-inner">
        {children}
      </div>
    </div>
  )
}
