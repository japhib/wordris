import { ReactNode } from "react";
import { BoardSize, PointsPerLetter } from "./Constants";
import GameGrid from "./GameGrid";
import { Coords } from "./Types";

export type LetterSquaresProps = {
    keyOffset: number,
    clickable: boolean,
    handlePlaceLetter: (index: number) => void,
    gameGrid: GameGrid,
    highlightedSquares: Coords[],
}

// The main playing area that letters are dropped into.
export default function LetterSquares(props: LetterSquaresProps) {
    console.log(props.highlightedSquares);
    const squares: ReactNode[] = [];
    for (let y = 0; y < BoardSize; y++) {
        const row: ReactNode[] = [];
        for (let x = 0; x < BoardSize; x++) {
            const handleClick =
                props.clickable ?
                () => props.handlePlaceLetter(x) :
                () => {};

            const letter = props.gameGrid.grid[y][x];

            const highlighted = props.highlightedSquares.some(sq => sq.x === x && sq.y === y);

            row.push(
                <div
                    key={x}
                    className={`wordris-square with-border ${props.clickable ? 'clickable' : ''} ${highlighted ? 'selected' : ''}`}
                    onClick={handleClick}
                >
                    {letter}

                    <div className="points">
                        {PointsPerLetter[letter!]}
                    </div>
                </div>
            )
        }
        squares.push(
            <div key={y + props.keyOffset} className="wordris-row">
                {row}
            </div>
        );
    }

    return squares;
}