import { ReactNode, useState } from "react";
import CircleFoundWords from "./CircleFoundWords";
import ClickableLetters from "./ClickableLetters";
import { BoardSize, getScore, NumLetters, shuffleLetters } from "./Constants";
import useForceUpdate from "./forceUpdate";
import GameGrid from "./GameGrid";
import LetterSquares from "./LetterSquares";
import { Coords, FoundWord, foundWordContainsOther, foundWordToCoordsList } from "./Types";

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

// Removes any words that are contained by other, higher-scoring words.
function massageFoundWords(words: FoundWord[]): FoundWord[] {
    const massaged: FoundWord[] = [];
    words.sort((wordA, wordB) => Math.sign(wordA.score - wordB.score));
    while (words.length > 0) {
        // get next highest scoring word
        const newWord = words.shift()!;
        // check if it's fully contained by any words already in the result array
        if (!massaged.some(word => foundWordContainsOther(word, newWord))) {
            massaged.push(newWord);
        }
    }
    return massaged;
}

function sumScore(words: FoundWord[]): number {
    return words
        // Floor the score to get rid of the directional bias
        .map(word => Math.floor(word.score))
        .reduce((prev, curr) => prev + curr);
}

export default function GameBoard() {
    const forceUpdate = useForceUpdate();
    const [gameState, setGameState] = useState<GameState>(GameState.ChooseLetter);
    const [selectedLetterIdx, setSelectedLetterIdx] = useState<number | null>(null);
    const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
    const [score, setScore] = useState<number>(0);
    const [letters, setLetters] = useState<string[]>(fetchLetters(NumLetters));

    const handleLetterClick = (index: number) => {
        if (gameState === GameState.ChooseLetter) {
            setSelectedLetterIdx(index);
        }
    }

    const checkForWords = () => {
        let foundWords = gameGrid.findWords();
        if (foundWords && foundWords.length > 0) {
            foundWords = massageFoundWords(foundWords);

            setFoundWords(foundWords);
            setGameState(GameState.FoundWord);

            setTimeout(() => {
                gameGrid.clearWords(foundWords);
                setScore(score + sumScore(foundWords));
                setGameState(GameState.ChooseLetter);
                setFoundWords([]);
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
            const plural = foundWords.length > 1 ? 's' : '';
            message = `Clearing word${plural}: ${foundWords.map(fw => fw.word).join(', ')}`;
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
            
            <div className="wordris-letter-area">
                {LetterSquares({
                    keyOffset: 2,
                    clickable: gameBoardClickable,
                    handlePlaceLetter,
                    gameGrid
                })}
                {CircleFoundWords({ foundWords })}
            </div>

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