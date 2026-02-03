'use client'

export default function SudokuCard({ onSolved }) {
  return (
    <>
      <h3>Sudoku</h3>
      <p>Resuelve el Sudoku para desbloquear el premio.</p>
      <button onClick={onSolved}>Simular Sudoku completado</button>
    </>
  )
}
