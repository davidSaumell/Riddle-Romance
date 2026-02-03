"use client"

import RiddleCard from "./RiddleCard"
import SudokuCard from "./SudokuCard"
import MinesweeperCard from "./MinesweeperCard"

export default function GameCard({ card, unlocked, unlock }) {

  if (unlocked) {
    return (
      <div className="card unlocked">
        <p>{card.reward}</p>
      </div>
    )
  }

  return (
    <div className="card">
      {card.type === "riddle" && (
        <RiddleCard card={card} onSolved={unlock} />
      )}
      {card.type === "sudoku" && (
        <SudokuCard onSolved={unlock} />
      )}
      {card.type === "minesweeper" && (
        <MinesweeperCard onSolved={unlock} />
      )}
    </div>
  )
}
