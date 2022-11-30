import { ReactNode } from "react";
import { SquareBorderPlusMargin, SquareSize } from "./Constants";
import { FoundWord } from "./Types"

export type CircleFoundWordsProps = {
    foundWords: FoundWord[]
}

function calcSquareSize(squares: number, adjust?: boolean) {
    return `calc((${SquareSize} + ${SquareBorderPlusMargin}) * ${squares}${adjust ? ' - 2px' : ''})`;
}

export default function CircleFoundWords({ foundWords }: CircleFoundWordsProps) {
    const circles: ReactNode[] = [];

    for (const foundWord of foundWords) {
        const wordWidth = Math.abs(foundWord.end.x - foundWord.start.x);
        const wordHeight = Math.abs(foundWord.end.y - foundWord.start.y);

        const startX = Math.min(foundWord.start.x, foundWord.end.x);
        const startY = Math.min(foundWord.start.y, foundWord.end.y);

        circles.push(
            <div
                className="found-word-circle"
                style={{
                    width: calcSquareSize(1 + wordWidth, true),
                    height: calcSquareSize(1 + wordHeight, true),
                    top: calcSquareSize(startY),
                    left: calcSquareSize(startX),
                }}
            ></div>
        )
    }

    return circles
}