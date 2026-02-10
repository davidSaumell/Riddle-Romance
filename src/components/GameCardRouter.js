import RiddleCard from "./RiddleCard"
import MinesweeperCard from "./MinesweeperCard"
import SudokuCard from "./SudokuCard"
import WordleCard from "./WordleCard"

export default function GameCardRouter({ card, isUnlocked, unlock, justUnlocked }) {
  switch (card.type) {
    case "riddle":
      return <RiddleCard card={card} isUnlocked={isUnlocked} unlock={unlock} justUnlocked={justUnlocked} />

    case "sudoku":
      return <SudokuCard card={card} isUnlocked={isUnlocked} unlock={unlock} justUnlocked={justUnlocked} />

    case "minesweeper":
      return <MinesweeperCard card={card} isUnlocked={isUnlocked} unlock={unlock} justUnlocked={justUnlocked}/>

    case "wordle":
      return <WordleCard card={card} isUnlocked={isUnlocked} unlock={unlock} justUnlocked={justUnlocked}/>

    default:
      return null
  }
}
