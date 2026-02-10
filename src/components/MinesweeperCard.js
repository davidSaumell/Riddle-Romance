"use client"

import { useState } from "react"

const DIFFICULTY_CONFIG = {
  easy: {
    desktop: { rows: 8, cols: 8, mines: 10 },
    mobile:  { rows: 10, cols: 6, mines: 10 }
  },
  medium: {
    desktop: { rows: 12, cols: 12, mines: 25 },
    mobile:  { rows: 16, cols: 8, mines: 25 }
  },
  hard: {
    desktop: { rows: 16, cols: 16, mines: 45 },
    mobile:  { rows: 25, cols: 10, mines: 45 }
  }
}

export default function MinesweeperCard({ card, isUnlocked, unlock, justUnlocked }) {
  const difficulty = card.difficulty ?? "easy"
  
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640
  const { rows: ROWS, cols: COLS, mines: MINES } =
    DIFFICULTY_CONFIG[difficulty][isMobile ? "mobile" : "desktop"]

  const CELL_SIZE = isMobile ? 34 : 40
  const GAP = 2

  const modalWidth = Math.min(
    COLS * (CELL_SIZE + GAP) + 80,
    window.innerWidth * 0.95
  )

  const [open, setOpen] = useState(false)
  const [grid, setGrid] = useState([])
  const [mines, setMines] = useState([])
  const [revealed, setRevealed] = useState(new Set())
  const [flags, setFlags] = useState(new Set())
  const [flagMode, setFlagMode] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [explodingCell, setExplodingCell] = useState(null)
  const [firstClick, setFirstClick] = useState(true)

  if (isUnlocked) return null

  const startGame = () => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill("")))
    setMines(new Set())
    setRevealed(new Set())
    setFlags(new Set())
    setFlagMode(false)
    setGameOver(false)
    setWon(false)
    setExplodingCell(null)
    setFirstClick(true)
  }

  const generateMines = (safeR, safeC) => {
    const minesSet = new Set()

    const forbidden = new Set()
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        forbidden.add(`${safeR + dr}-${safeC + dc}`)
      }
    }

    while (minesSet.size < MINES) {
      const r = Math.floor(Math.random() * ROWS)
      const c = Math.floor(Math.random() * COLS)
      const key = `${r}-${c}`

      if (!forbidden.has(key)) {
        minesSet.add(key)
      }
    }

    setMines(minesSet)
    return minesSet
  }

  const countMines = (r, c, minesSet = mines) => {
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
          minesSet.has(`${nr}-${nc}`)
        ) {
          count++
        }
      }
    }
    return count
  }

  const floodFill = (r, c, newRevealed, minesSet = mines) => {
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

    if (countMines(r, c, minesSet) === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          floodFill(r + dr, c + dc, newRevealed, minesSet)
        }
      }
    }
  }

  const toggleFlag = (key) => {
    if (gameOver || revealed.has(key)) return

    const newFlags = new Set(flags)
    newFlags.has(key) ? newFlags.delete(key) : newFlags.add(key)
    setFlags(newFlags)
  }

  const revealAllMines = () => {
    setRevealed((prev) => {
      const copy = prev.map((row) => [...row])
      mines.forEach(([r, c]) => {
        copy[r][c] = true
      })
      return copy
    })
  }

  const handleClick = (r, c) => {
    if (gameOver) return

    const key = `${r}-${c}`

    if (firstClick) {
      const newMines = generateMines(r, c)
      setFirstClick(false)

      const newRevealed = new Set(revealed)
      floodFill(r, c, newRevealed, newMines)
      setRevealed(newRevealed)
      return
    }

    if (flagMode) {
      const newFlags = new Set(flags)
      newFlags.has(key) ? newFlags.delete(key) : newFlags.add(key)
      setFlags(newFlags)
      return
    }

    if (flags.has(key)) return

    if (mines.has(key)) {
      setExplodingCell(key)
      setGameOver(true)

      setTimeout(() => {
        setRevealed(new Set([...revealed, ...mines]))
      }, 350)
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
      <div className={`game-card ${justUnlocked ? "unlock-anim" : ""}`}>
        <h3>Pescamines</h3>
        <p>Dificultat: {difficulty}</p>
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
          <div className="modal" style={{ width: modalWidth }}>
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

            <div className="minesweeper-grid" style={{ gridTemplateColumns: `repeat(${COLS}, 40px)` }}>
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
                        ${explodingCell === `${r}-${c}` ? "exploding" : ""}
                      `}
                      onClick={() => handleClick(r, c)}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        toggleFlag(key)
                      }}
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
