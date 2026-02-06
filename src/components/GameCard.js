"use client"

export default function GameCard({
  title,
  description,
  reward,
  status = "locked", // locked | active | completed
  onAction,
}) {
  return (
    <div className="card">
      <div className={`ticket ${status}`}>
        <div className="ticket-side">🎟</div>

        <div className="ticket-content">
          <div className="status">
            {status === "locked" ? "LOCKED" : "UNLOCKED"}
          </div>

          <h3>{title}</h3>
          <p>{description}</p>

          <button onClick={onAction}>
            Redeem Ticket
          </button>
        </div>
      </div>
    </div>
  )
}
