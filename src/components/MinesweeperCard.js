'use client'

export default function MinesweeperCard({ onSolved }) {
  return (
    <>
      <h3>Buscaminas</h3>
      <p>Evita las minas para ganar.</p>
      <button onClick={onSolved}>Simular Buscaminas completado</button>
    </>
  )
}
