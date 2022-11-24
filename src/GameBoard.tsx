import { ReactNode } from "react";

const BoardSize = 7;
const NumLetters = 5;

const letterContents = [
    'A', 'B', 'C', 'D', 'E'
]

export default function GameBoard() {
    const letters: ReactNode[] = [];
    const numEmptyBoxes = (BoardSize - NumLetters) / 2;
    for (let x = 0; x < BoardSize; x++) {
        let borderClass = '';
        let thisLetterContent = '';
        if (x >= numEmptyBoxes && x < (BoardSize - numEmptyBoxes)) {
            borderClass = 'with-border';
            thisLetterContent = letterContents[x - numEmptyBoxes];
        }
        letters.push(
            <div key={x} className={"wordris-square letter-choice " + borderClass}>
                {thisLetterContent}
            </div>
        )
    }

    // empty row!
    const arrows: ReactNode[] = [];
    for (let x = 0; x < BoardSize; x++) {
        arrows.push(
            <div key={x} className="wordris-square"></div>
        )
    }

    const squares: ReactNode[] = [];
    for (let y = 0; y < BoardSize; y++) {
        const row: ReactNode[] = [];
        for (let x = 0; x < BoardSize; x++) {
            row.push(
                <div key={x} className="wordris-square with-border"></div>
            )
        }
        squares.push(
            <div key={y+2} className="wordris-row">
                {row}
            </div>
        );
    }

    return (
        <div className="wordris-gameboard">
            <div key={0} className="wordris-row">
                {letters}
            </div>
            <div key={1} className="wordris-row">
                {arrows}
            </div>
            {squares}

            <div className="bottom-label">Choose a letter!</div>
        </div>
    )
}