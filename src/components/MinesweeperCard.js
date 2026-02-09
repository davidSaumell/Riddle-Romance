"use client"

import { useState } from "react"

const ROWS = 8
const COLS = 8
const MINES = 10

export default function MinesweeperCard({ card, isUnlocked, unlock }) {
  const [open, setOpen] = useState(false)
  const [grid, setGrid] = useState([])
  const [mines, setMines] = useState([])
  const [revealed, setRevealed] = useState(new Set())
  const [flags, setFlags] = useState(new Set())
  const [flagMode, setFlagMode] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  if (isUnlocked) return null

  const startGame = () => {
    const minesSet = new Set()
    while (minesSet.size < MINES) {
      const r = Math.floor(Math.random() * ROWS)
      const c = Math.floor(Math.random() * COLS)
      minesSet.add(`${r}-${c}`)
    }

    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill("")))
    setMines(minesSet)
    setRevealed(new Set())
    setFlags(new Set())
    setFlagMode(false)
    setGameOver(false)
    setWon(false)
  }

  const countMines = (r, c) => {
    let count = 0
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const nr = r + dr
        const nc = c + dc
        if (
          nr >= 0 &&
          nr < ROWS &&
          nc >= 0 &&
          nc < COLS &&
          mines.has(`${nr}-${nc}`)
        ) {
          count++
        }
      }
    }
    return count
  }

  const floodFill = (r, c, newRevealed) => {
    const key = `${r}-${c}`
    if (
      r < 0 ||
      r >= ROWS ||
      c < 0 ||
      c >= COLS ||
      newRevealed.has(key)
    )
      return

    newRevealed.add(key)

    if (countMines(r, c) === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          floodFill(r + dr, c + dc, newRevealed)
        }
      }
    }
  }

  const handleClick = (r, c) => {
    if (gameOver) return

    const key = `${r}-${c}`

    if (flagMode) {
      const newFlags = new Set(flags)
      newFlags.has(key) ? newFlags.delete(key) : newFlags.add(key)
      setFlags(newFlags)
      return
    }

    if (flags.has(key)) return

    if (mines.has(key)) {
      setGameOver(true)
      setRevealed(
        new Set([...revealed, ...mines])
      )
      return
    }

    const newRevealed = new Set(revealed)
    floodFill(r, c, newRevealed)
    setRevealed(newRevealed)

    if (newRevealed.size === ROWS * COLS - MINES) {
      setWon(true)
      setTimeout(() => {
        unlock(card.id)
        setOpen(false)
      }, 1400)
    }
  }

  return (
    <>
      <div className="game-card">
        <h3>Minesweeper</h3>
        <button
          onClick={() => {
            startGame()
            setOpen(true)
          }}
        >
          Empezar
        </button>
      </div>

      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Buscaminas</h2>
              <button className="close" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="minesweeper-toolbar">
              <span>💣 {MINES}</span>
              <button
                className={flagMode ? "flag-active" : ""}
                onClick={() => setFlagMode((f) => !f)}
              >
                🚩
              </button>
              <span>🚩 {flags.size}</span>
            </div>

            <div className="minesweeper-grid">
              {grid.map((row, r) =>
                row.map((_, c) => {
                  const key = `${r}-${c}`
                  const isRevealed = revealed.has(key)
                  const isMine = mines.has(key)
                  const isFlag = flags.has(key)

                  let content = ""
                  if (isRevealed && isMine) content = "💣"
                  else if (isRevealed) {
                    const n = countMines(r, c)
                    content = n > 0 ? n : ""
                  } else if (isFlag) content = "🚩"

                  return (
                    <div
                      key={key}
                      className={`
                        mine-cell
                        ${isRevealed ? "revealed" : ""}
                        ${isMine && isRevealed ? "mine" : ""}
                      `}
                      onClick={() => handleClick(r, c)}
                    >
                      {content}
                    </div>
                  )
                })
              )}
            </div>

            {won && (
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
