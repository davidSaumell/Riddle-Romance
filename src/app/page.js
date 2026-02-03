import Link from "next/link"

export default function Home() {
  return (
    <section className="container">
      <h1>Un juego para compartir momentos</h1>

      <p>
        Una colección de acertijos y minijuegos pensados para disfrutar en pareja.
        Cada reto desbloquea pequeños regalos y experiencias juntos.
      </p>

      <Link href="/games">
        <button>Empezar</button>
      </Link>
    </section>
  )
}
