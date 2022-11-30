import { ReactNode, useState } from "react";
import ClickableLetters from "./ClickableLetters";
import { BoardSize, getScore, NumLetters, shuffleLetters } from "./Constants";
import useForceUpdate from "./forceUpdate";
import GameGrid from "./GameGrid";
import LetterSquares from "./LetterSquares";
import { Coords, FoundWord, foundWordToCoordsList } from "./Types";

enum GameState {
    ChooseLetter = 0,
    FoundWord = 1,
    DropLetterAnimation = 2,
}

type DroppingLetter = {
    letter: string,
    target: Coords,
    current: Coords
}

// Is this weird? That some state is in these objects instead of useState?
// Probably fine as long as we're careful to reset the state of these properly
// between each game.
const gameGrid = new GameGrid();

let letters = shuffleLetters();
function nextLetter(): string {
    const letter = letters.shift();

    if (letters.length === 0) {
        // refill it
        letters = shuffleLetters();
    }

    return letter!;
}
function fetchLetters(numLetters: number): string[] {
    const ret = [];
    for (let i = 0; i < numLetters; i++) {
        ret.push(nextLetter());
    }
    return ret;
}

let droppingLetter: DroppingLetter | null = null;

function getHighestScoringWord(words: FoundWord[]): FoundWord {
    let maxIdx = -1;
    let maxScore = 0;
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word.score > maxScore) {
            maxIdx = i;
        }
    }
    return words[maxIdx];
}

export default function GameBoard() {
    const forceUpdate = useForceUpdate();
    const [gameState, setGameState] = useState<GameState>(GameState.ChooseLetter);
    const [selectedLetterIdx, setSelectedLetterIdx] = useState<number | null>(null);
    const [foundWord, setFoundWord] = useState<FoundWord | null>(null);
    const [score, setScore] = useState<number>(0);
    const [letters, setLetters] = useState<string[]>(fetchLetters(NumLetters));

    const handleLetterClick = (index: number) => {
        if (gameState === GameState.ChooseLetter) {
            setSelectedLetterIdx(index);
        }
    }

    const checkForWords = () => {
        const foundWords = gameGrid.findWords();
        if (foundWords && foundWords.length > 0) {
            const foundWord = getHighestScoringWord(foundWords);
            // Floor the score to get rid of the bias (which makes it prefer right/down over up)
            foundWord.score = Math.floor(foundWord.score);

            setGameState(GameState.FoundWord);
            setFoundWord(foundWord);

            setTimeout(() => {
                gameGrid.clearWord(foundWord);
                setScore(score + getScore(foundWord.word));
                setGameState(GameState.ChooseLetter);
                setFoundWord(null);
                checkForWords();
            }, 1000);
        }
    }

    const letterDropAnimation = async () => {
        setGameState(GameState.DropLetterAnimation);

        gameGrid.set(droppingLetter!.current, droppingLetter!.letter);
        while (droppingLetter!.current.y !== droppingLetter!.target.y && droppingLetter!.current.y < BoardSize) {
            forceUpdate();
            await new Promise((resolve, _reject) => setTimeout(resolve, 50));

            gameGrid.set(droppingLetter!.current, null);
            droppingLetter!.current.y++;
            gameGrid.set(droppingLetter!.current, droppingLetter!.letter);
        }

        setGameState(GameState.ChooseLetter);

        checkForWords();
        forceUpdate();
    }

    const handlePlaceLetter = (index: number) => {
        const letterToPlace: string = letters[selectedLetterIdx!];
        if (letterToPlace === undefined) {
            console.error('letterToPlace undefined, selectedLetterIdx:', selectedLetterIdx);
            return;
        }

        letters[selectedLetterIdx!] = nextLetter();
        setLetters(letters);
        setSelectedLetterIdx(null);

        const target = gameGrid.placeLetter(letterToPlace, index);
        if (!target) {
            console.log('gameGrid.placeLetter returned false');
            checkForWords();
            forceUpdate();
        } else {
            droppingLetter = { letter: letterToPlace, target, current: { x: target.x, y: 0 }};
            letterDropAnimation();
        }
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

        case GameState.FoundWord:
            message = `Found word: ${foundWord!.word}`;
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
            <div>Score: {score}</div>

            <div key={1} className="wordris-row arrow-row">
                {arrows}
            </div>
            {LetterSquares({
                keyOffset: 2,
                clickable: gameBoardClickable,
                handlePlaceLetter,
                gameGrid,
                highlightedSquares: foundWord ? foundWordToCoordsList(foundWord) : [],
            })}

            <div key={0} className="wordris-row choose-letters">
                {ClickableLetters({
                    clickable: gameState === GameState.ChooseLetter,
                    handleClick: handleLetterClick,
                    selectedIndex: selectedLetterIdx,
                    letters
                })}
            </div>
 
            <div className="bottom-label">{message}</div>
        </div>
    )
}