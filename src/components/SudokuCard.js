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
  const [errors, setErrors] = useState(0)

  if (isUnlocked) return null

  const handleTileClick = (r, c) => {
    if (!selectedNumber) return
    if (grid[r][c] !== "-") return

    if (solution[r][c] === selectedNumber) {
      const newGrid = grid.map((row) => [...row])
      newGrid[r][c] = selectedNumber
      setGrid(newGrid)

      const finished = newGrid.every((row, i) =>
        row.every((cell, j) => cell === solution[i][j])
      )

      if (finished) {
        unlock(card.id)
        setOpen(false)
      }
    } else {
      setErrors((e) => e + 1)
    }
  }

  return (
    <>
      <div className="game-card">
        <h3>Sudoku</h3>
        <p>Completa el sudoku sin errores</p>
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

            <p>Errores: {errors}</p>

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
                        ${r === 2 || r === 5 ? "bottom-border" : ""}
                        ${c === 2 || c === 5 ? "right-border" : ""}
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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  className={selectedNumber === String(n) ? "selected" : ""}
                  onClick={() => setSelectedNumber(String(n))}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
