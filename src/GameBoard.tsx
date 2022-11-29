import { ReactNode, useState } from "react";
import ClickableLetters from "./ClickableLetters";
import { BoardSize, letterContents } from "./Constants";
import LetterSquares from "./LetterSquares";

enum GameState {
    ChooseLetter = 0
}

export default function GameBoard() {
    const [gameState, setGameState] = useState<GameState>(GameState.ChooseLetter);
    const [selectedLetterIdx, setSelectedLetterIdx] = useState<number | null>(null);

    const handleLetterClick = (index: number) => {
        if (gameState === GameState.ChooseLetter) {
            setSelectedLetterIdx(index);
        }
    }

    const handlePlaceLetter = (index: number) => {
        const letterToPlace: string = letterContents[selectedLetterIdx!];
        if (letterToPlace === undefined) {
            console.error('letterToPlace undefined, selectedLetterIdx:', selectedLetterIdx);
            return;
        }

        console.log('handlePlaceLetter', index);
    }

    let message: string;
    let gameBoardClickable = false;
    switch (gameState) {
        case GameState.ChooseLetter:
            if (selectedLetterIdx === null) {
                message = 'Choose a letter!';
            } else {
                message = 'Choose where to place the letter!';
                gameBoardClickable = true;
            }
            break;
        default:
            message = '';
            break;
    }

    // empty row!
    const arrows: ReactNode[] = [];
    for (let x = 0; x < BoardSize; x++) {
        const handleClick =
            gameBoardClickable ?
            () => handlePlaceLetter(x) :
            () => {};

        arrows.push(
            <div key={x} className={`wordris-square ${gameBoardClickable ? 'clickable' : ''}`} onClick={handleClick}>
                {gameBoardClickable ? '⬇️' : ''}
            </div>
        )
    }

    return (
        <div className="wordris-gameboard">
            <div key={0} className="wordris-row">
                {ClickableLetters({
                    clickable: gameState === GameState.ChooseLetter,
                    handleClick: handleLetterClick,
                    selectedIndex: selectedLetterIdx
                })}
            </div>
            <div key={1} className="wordris-row arrow-row">
                {arrows}
            </div>
            {LetterSquares({keyOffset: 2, clickable: gameBoardClickable, handlePlaceLetter})}

            <div className="bottom-label">{message}</div>
        </div>
    )
}