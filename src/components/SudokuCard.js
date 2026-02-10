"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function SudokuCard({ card, isUnlocked, unlock, justUnlocked }) {
  const [open, setOpen] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState(null)
  const [grid, setGrid] = useState([])
  const [sudoku, setSudoku] = useState(null)

  const MAX_LIVES = 3
  const [errors, setErrors] = useState(0)
  const livesLeft = MAX_LIVES - errors
  const [animatedCell, setAnimatedCell] = useState(null)
  const [errorCell, setErrorCell] = useState(null)
  const [completed, setCompleted] = useState(false)

  const countNumber = (num) => {
    return grid.flat().filter((c) => c === num).length
  }

  const loadSudoku = async () => {
    const difficulty = card.difficulty ?? "easy"

    if (!card.difficulty) {
      console.warn("Sudoku sin dificultad definida → usando easy", card)
    }

    const { data, error } = await supabase
      .from("sudokus")
      .select("*")
      .eq("difficulty", difficulty)

    if (error || !data.length) return

    const random = data[Math.floor(Math.random() * data.length)]
    setSudoku(random)
    setGrid(random.board.map((r) => r.split("")))
    setErrors(0)
    setSelectedNumber(null)
  }

  if (isUnlocked) return null

  const handleTileClick = (r, c) => {
    if (!selectedNumber) return
    if (grid[r][c] !== "-") return

    if (sudoku.solution[r][c] === selectedNumber) {
      const newGrid = grid.map((row) => [...row])
      newGrid[r][c] = selectedNumber
      setGrid(newGrid)

      setAnimatedCell(`${r}-${c}`)
      setTimeout(() => setAnimatedCell(null), 200)

      const finished = newGrid.every((row, i) =>
        row.every((cell, j) => cell === sudoku.solution[i][j])
      )

      if (finished) {
        setCompleted(true)
        setTimeout(() => {
          unlock(card.id)
          setOpen(false)
          setCompleted(false)
        }, 1400)
      }
    } else {
      setErrors((e) => Math.min(e + 1, MAX_LIVES))
      setErrorCell(`${r}-${c}`)

      setTimeout(() => setErrorCell(null), 500)

      if (errors + 1 >= MAX_LIVES) {
        setTimeout(() => {
          alert("Has perdido 😢")
          setOpen(false)
        }, 300)
      }
    }
  }

  return (
    <>
      <div className={`game-card ${justUnlocked ? "unlock-anim" : ""}`}>
        <h3>Sudoku</h3>
        <p>Dificultat: {card.difficulty || "easy"}</p>
        <button
          onClick={() => {
            loadSudoku()
            setOpen(true)
          }}
        >
          Empezar
        </button>
      </div>

      {open && sudoku && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Sudoku</h2>
              <button className="close" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="lives">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`heart ${i <= livesLeft ? "alive" : "dead"}`}
                >
                  ❤
                </span>
              ))}
            </div>

            <div className="sudoku-grid">
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const fixed = sudoku.board[r][c] !== "-"
                  return (
                    <input
                      key={`${r}-${c}`}
                      className={`
                        sudoku-cell
                        ${fixed ? "fixed" : ""}
                        ${cell === selectedNumber ? "highlight" : ""}
                        ${r === 2 || r === 5 ? "bottom-border" : ""}
                        ${c === 2 || c === 5 ? "right-border" : ""}
                        ${animatedCell === `${r}-${c}` ? "correct-anim" : ""}
                        ${errorCell === `${r}-${c}` ? "error-anim" : ""}
                      `}
                      value={cell === "-" ? "" : cell}
                      readOnly
                      onClick={() => handleTileClick(r, c)}
                    />
                  )
                })
              )}
            </div>

            <div className="digits">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                const value = String(n)
                const usedUp = countNumber(value) >= 9

                return (
                  <button
                    key={n}
                    disabled={usedUp}
                    className={`
                      ${selectedNumber === value ? "selected" : ""}
                      ${usedUp ? "digit-disabled" : ""}
                    `}
                    onClick={() => setSelectedNumber(value)}
                  >
                    {n}
                  </button>
                )
              })}
            </div>

            {completed && (
              <div className="sudoku-complete-overlay">
                ✓ Completado
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
