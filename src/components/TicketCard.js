export default function TicketCard({ card }) {
  return (
    <div className="ticket">
      <div className="ticket-side">🎟</div>

      <div className="ticket-content">
        <div className="status">UNLOCKED</div>
        <h3>Recompensa</h3>
        <p>{card.reward}</p>

        <button>Redeem Ticket</button>
      </div>
    </div>
  )
}
