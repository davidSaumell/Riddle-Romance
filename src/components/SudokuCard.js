"use client"

import { useState } from "react"

const board = [
  "--74916-5",
  "2---6-3-9",
  "-----7-1-",
  "-586----4",
  "--3----9-",
  "--62--187",
  "9-4-7---2",
  "67-83----",
  "81--45---",
]

const solution = [
  "387491625",
  "241568379",
  "569327418",
  "758619234",
  "123784596",
  "496253187",
  "934176852",
  "675832941",
  "812945763",
]

export default function SudokuCard({ card, isUnlocked, unlock }) {
  const [open, setOpen] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState(null)
  const [grid, setGrid] = useState(
    board.map((row) => row.split(""))
  )
  const MAX_LIVES = 3
  const [errors, setErrors] = useState(0)
  const livesLeft = MAX_LIVES - errors
  const [animatedCell, setAnimatedCell] = useState(null)
  const [errorCell, setErrorCell] = useState(null)
  const [errorAnim, setErrorAnim] = useState(false)
  const [completed, setCompleted] = useState(false)
  
  const countNumber = (num) => {
    return grid.flat().filter((c) => c === num).length
  }

  if (isUnlocked) return null

  const handleTileClick = (r, c) => {
    if (!selectedNumber) return
    if (grid[r][c] !== "-") return

    if (solution[r][c] === selectedNumber) {
      const newGrid = grid.map((row) => [...row])
      newGrid[r][c] = selectedNumber
      setGrid(newGrid)

      setAnimatedCell(`${r}-${c}`)
      setTimeout(() => setAnimatedCell(null), 180)

      const finished = newGrid.every((row, i) =>
        row.every((cell, j) => cell === solution[i][j])
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
      if (errors + 1 >= MAX_LIVES) {
        setTimeout(() => {
          alert("Has perdido 😢")
          setOpen(false)
        }, 300)
      }
      setErrorCell(`${r}-${c}`)
      setErrorAnim(true)

      setTimeout(() => {
        setErrorCell(null)
        setErrorAnim(false)
      }, 500)
    }
  }

  return (
    <>
      <div className="game-card">
        <h3>Sudoku</h3>
        <p>Completa el sudoku</p>
        <button onClick={() => setOpen(true)}>Empezar</button>
      </div>

      {open && (
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
                  const fixed = board[r][c] !== "-"
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
              {[1,2,3,4,5,6,7,8,9].map((n) => {
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
