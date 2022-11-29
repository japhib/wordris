import { ReactNode } from "react";
import { BoardSize, letterContents, NumLetters } from "./Constants";

export type ClickableLettersProps = {
    clickable: boolean,
    handleClick: (index: number) => void,
    selectedIndex: number | null,
}

// The letters in boxes at the top that you click to send down into the main area.
export default function ClickableLetters(props: ClickableLettersProps) {
    const letters: ReactNode[] = [];
    const numEmptyBoxes = (BoardSize - NumLetters) / 2;
    const clickableClass = props.clickable ? 'clickable' : '';
    for (let x = 0; x < BoardSize; x++) {
        let borderClass = '';
        let thisLetterContent = '';
        let selectedClass = '';
        let letterIdx = x - numEmptyBoxes;
        let onClick = undefined;
        if (x >= numEmptyBoxes && x < (BoardSize - numEmptyBoxes)) {
            borderClass = 'with-border';
            thisLetterContent = letterContents[letterIdx];
            selectedClass = letterIdx === props.selectedIndex ? 'selected' : '';
            onClick = () => props.handleClick(letterIdx);
        }
        letters.push(
            <div
                key={x}
                className={`wordris-square letter-choice ${borderClass} ${clickableClass} ${selectedClass}`}
                onClick={onClick}
            >
                {thisLetterContent}
            </div>
        )
    }

    return letters;
}