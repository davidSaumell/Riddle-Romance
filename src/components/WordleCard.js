"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

const ROWS = 6
const COLS = 5

export default function WordleCard({ card, isUnlocked, unlock }) {
  const [open, setOpen] = useState(false)
  const [solution, setSolution] = useState("")
  const [grid, setGrid] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  )
  const [status, setStatus] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  )
  const [row, setRow] = useState(0)
  const [col, setCol] = useState(0)
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)

  const loadWord = async () => {
    const { data, error } = await supabase
      .from("wordle_words")
      .select("word")
      .eq("active", true)

    if (error || !data?.length) return

    const random = data[Math.floor(Math.random() * data.length)]
    setSolution(random.word.toUpperCase())

    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill("")))
    setStatus(Array.from({ length: ROWS }, () => Array(COLS).fill("")))
    setRow(0)
    setCol(0)
    setWon(false)
    setLost(false)
  }

  useEffect(() => {
    if (!open || won || lost) return

    const handleKey = (e) => {
      if (e.key === "Backspace") {
        if (col > 0) {
          const newGrid = grid.map((r) => [...r])
          newGrid[row][col - 1] = ""
          setGrid(newGrid)
          setCol(col - 1)
        }
      }

      if (e.key === "Enter") {
        if (col === COLS) submitRow()
      }

      if (/^[a-zA-Z]$/.test(e.key)) {
        if (col < COLS) {
          const newGrid = grid.map((r) => [...r])
          newGrid[row][col] = e.key.toUpperCase()
          setGrid(newGrid)
          setCol(col + 1)
        }
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, grid, row, col, won, lost])

  const submitRow = () => {
    const guess = grid[row].join("")
    if (guess.length < 5) return

    const sol = solution.split("")
    const guessArr = guess.split("")
    const newStatus = [...status.map((r) => [...r])]

    const used = Array(5).fill(false)

    for (let i = 0; i < 5; i++) {
      if (guessArr[i] === sol[i]) {
        newStatus[row][i] = "correct"
        used[i] = true
        sol[i] = null
      }
    }

    for (let i = 0; i < 5; i++) {
      if (newStatus[row][i]) continue
      const idx = sol.indexOf(guessArr[i])
      if (idx !== -1 && !used[idx]) {
        newStatus[row][i] = "present"
        sol[idx] = null
      } else {
        newStatus[row][i] = "absent"
      }
    }

    setStatus(newStatus)

    if (guess === solution) {
      setWon(true)
      setTimeout(() => {
        unlock(card.id)
        setOpen(false)
      }, 1400)
      return
    }

    if (row === ROWS - 1) {
      setLost(true)
      return
    }

    setRow(row + 1)
    setCol(0)
  }

  if (isUnlocked) return null

  return (
    <>
      <div className="game-card">
        <h3>Wordle</h3>
        <p>Adivina la paraula</p>
        <button
          onClick={() => {
            loadWord()
            setOpen(true)
          }}
        >
          Començar
        </button>
      </div>

      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Wordle</h2>
              <button className="close" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="wordle-grid">
              {grid.map((r, ri) => (
                <div key={ri} className="wordle-row">
                  {r.map((cell, ci) => (
                    <div
                      key={ci}
                      className={`
                        wordle-cell
                        ${status[ri][ci] || ""}
                      `}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {won && (
              <div className="sudoku-complete-overlay">
                ✓ Completado
              </div>
            )}

            {lost && (
              <div className="wordle-lost">
                ❌ La palabra era <b>{solution}</b>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
