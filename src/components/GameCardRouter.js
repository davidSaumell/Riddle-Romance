import RiddleCard from "./RiddleCard"
import MinesweeperCard from "./MinesweeperCard"
import SudokuCard from "./SudokuCard"

export default function GameCardRouter({ card, isUnlocked, unlock }) {
  switch (card.type) {
    case "riddle":
      return <RiddleCard card={card} isUnlocked={isUnlocked} unlock={unlock} />

    case "sudoku":
      return <SudokuCard card={card} isUnlocked={isUnlocked} unlock={unlock} />

    case "minesweeper":
      return <MinesweeperCard card={card} isUnlocked={isUnlocked} unlock={unlock} />

    default:
      return null
  }
}
