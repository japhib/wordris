import { ReactNode, useEffect, useState } from "react";
import CircleFoundWords from "./CircleFoundWords";
import ClickableLetters from "./ClickableLetters";
import { BoardSize, NumLetters, shuffleLetters, TimerMillis } from "./Constants";
import useForceUpdate from "./forceUpdate";
import GameGrid from "./GameGrid";
import LetterSquares from "./LetterSquares";
import { Coords, FoundWord } from "./Types";

export type GameBoardProps = {
    timerEnabled: boolean,
};

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

function multiplierForWord(word: string): number {
    if (word.length <= 3) {
        return 1;
    } else if (word.length === 4) {
        return 1.5;
    } else {
        return word.length - 3;
    }
}

function sumScore(words: FoundWord[]) {
    // Multipliers:
    // 4 letter word: 1.5x
    // 5+ letter word: 2x+ (word.length - 3)
    // Each additional word multiplies the entire multiplier by 2
    // (so 3 words at once is x4, 4 words is x8, ...)

    const baseScore = words
        // Floor the score to get rid of the directional bias
        .map(word => Math.floor(word.score))
        .reduce((prev, curr) => prev + curr);

    let lengthMultiplier = 1;
    for (const word of words) {
        lengthMultiplier *= multiplierForWord(word.word);
    }
    let multiWordMultiplier = 1;
    if (words.length > 1) {
        multiWordMultiplier *= Math.pow(2, words.length - 1);
    }

    const finalScore = Math.round(baseScore * multiWordMultiplier * lengthMultiplier);

    let desc = words.map(fw => fw.word).join(', ') + ' - ' + baseScore;
    let addFinalScore = false;
    if (lengthMultiplier > 1) {
        addFinalScore = true;
        desc += `, x${lengthMultiplier} len`;
    }
    if (multiWordMultiplier > 1) {
        addFinalScore = true;
        desc += `, x${multiWordMultiplier} multi`;
    }
    if (addFinalScore) {
        desc += ` = ${finalScore}`;
    }

    return { score: finalScore, desc }
}

let windowHasFocus = true;

export default function GameBoard(props: GameBoardProps) {
    const forceUpdate = useForceUpdate();
    const [paused, setPaused] = useState<boolean>(false);
    const [gameState, setGameState] = useState<GameState>(GameState.ChooseLetter);
    const [selectedLetterIdx, setSelectedLetterIdx] = useState<number | null>(null);
    const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
    const [score, setScore] = useState<number>(0);
    const [letters, setLetters] = useState<string[]>(fetchLetters(NumLetters));
    // timeLeft in ms 
    const [timeLeft, setTimeLeft] = useState<number>(TimerMillis);
    // cleared words + scores
    let [history, setHistory] = useState<string[]>([]);

    // handle window focus/blur events
    window.onfocus = () => {
        windowHasFocus = true;
        forceUpdate();
    }
    window.onblur = () => windowHasFocus = false;
    const actuallyPaused = paused || !windowHasFocus;

    const handleLetterClick = (index: number) => {
        if (gameState === GameState.ChooseLetter) {
            setSelectedLetterIdx(index);
        }
    }

    const checkForWords = () => {
        let foundWords = gameGrid.findWords();
        if (foundWords && foundWords.length > 0) {
            setFoundWords(foundWords);
            setGameState(GameState.FoundWord);

            setTimeout(() => {
                gameGrid.clearWords(foundWords);

                const newScore = sumScore(foundWords);
                setScore(score + newScore.score);
                history.splice(0, 0, newScore.desc);
                if (history.length > 5) {
                    history = history.slice(0, 5);
                }
                setHistory(history);

                setGameState(GameState.ChooseLetter);
                setTimeLeft(TimerMillis);
                setFoundWords([]);
                checkForWords();
            }, 1000);
        }
    }

    const letterDropAnimation = async () => {
        setGameState(GameState.DropLetterAnimation);

        gameGrid.set(droppingLetter!.current, droppingLetter!.letter);
        let timesWaited = 0;
        while (droppingLetter!.current.y !== droppingLetter!.target.y && droppingLetter!.current.y < BoardSize) {
            timesWaited++;
            forceUpdate();
            await new Promise((resolve, _reject) => setTimeout(resolve, 50));

            gameGrid.set(droppingLetter!.current, null);
            droppingLetter!.current.y++;
            gameGrid.set(droppingLetter!.current, droppingLetter!.letter);
        }
        // prevent double drop (race condition)
        if (timesWaited === 0) {
            forceUpdate();
            await new Promise((resolve, _reject) => setTimeout(resolve, 50));
        }

        setGameState(GameState.ChooseLetter);
        setTimeLeft(TimerMillis);

        checkForWords();
        forceUpdate();
    }

    const handlePlaceLetter = (column: number, letterIdx: number) => {
        if (gameState !== GameState.ChooseLetter) {
            return;
        }

        const letterToPlace: string = letters[letterIdx];
        if (letterToPlace === undefined) {
            console.error('letterToPlace undefined, letterIdx:', letterIdx);
            return;
        }

        letters[letterIdx] = nextLetter();
        setLetters(letters);
        
        // Only clear selection if the selected one got dropped
        if (letterIdx === selectedLetterIdx)
            setSelectedLetterIdx(null);

        const target = gameGrid.getOpenSpaceInColumn(column);
        if (!target) {
            console.log('gameGrid.placeLetter returned false');
            checkForWords();
            forceUpdate();
        } else {
            droppingLetter = { letter: letterToPlace, target, current: { x: target.x, y: 0 }};
            letterDropAnimation();
        }
    }

    const handlePlaceSelectedLetter = (column: number) => {
        handlePlaceLetter(column, selectedLetterIdx!);
    }

    const dropRandomLetter = () => {
        const randomLetterIdx = Math.floor(Math.random() * NumLetters);
        const randomColumn = gameGrid.getRandomNonFullColumn();
        handlePlaceLetter(randomColumn, randomLetterIdx);
    }

    if (props.timerEnabled) {
        const updateTimer = () => {
            const timerGoing = gameState === GameState.ChooseLetter;
            if (timerGoing && !actuallyPaused) {
                let newTimeLeft = timeLeft - 100;
                if (newTimeLeft <= 0) {
                    newTimeLeft = 0;
                    dropRandomLetter();
                }
                setTimeLeft(newTimeLeft);
            }
        }
        // Call updateTimer() every .1 seconds
        useEffect(() => {
            const intervalId = setInterval(updateTimer, 100);
            return () => {
                clearInterval(intervalId);
            }
        })
    }

    let message: string;
    let gameBoardClickable = false;
    switch (gameState) {
        case GameState.ChooseLetter:
        case GameState.DropLetterAnimation:
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
    if (actuallyPaused) {
        message = '⏸️';
    }

    // empty row!
    const arrows: ReactNode[] = [];
    for (let x = 0; x < BoardSize; x++) {
        const handleClick =
            gameBoardClickable ?
            () => handlePlaceSelectedLetter(x) :
            () => {};

        arrows.push(
            <div key={x} className={`wordris-square ${gameBoardClickable ? 'clickable' : ''}`} onClick={handleClick}>
                {gameBoardClickable ? '⬇️' : ''}
            </div>
        )
    }

    // history
    const historyDivs = [];
    for (const historyStr of history) {
        historyDivs.push(<div className="word-history-item">{historyStr}</div>)
    }

    return (
        <>
            <h2 className="game-mode">{props.timerEnabled ? 'Time Attack' : 'Zen Mode'}</h2>
            <div className="wordris-gameboard">

                <div className="score-display">Score: {score}</div>

                {props.timerEnabled ?
                    <div className="timer-display">
                        Time: {(timeLeft / 1000).toFixed(1)}
                        <div className="timer-fill" style={{
                            width: (timeLeft / TimerMillis * 100) + '%'
                        }}></div>
                    </div>
                : null}

                <div key={1} className="wordris-row arrow-row">
                    {arrows}
                </div>
                
                <div className="wordris-letter-area">
                    { actuallyPaused ? <div className="paused"></div> : null }
                    {LetterSquares({
                        keyOffset: 2,
                        clickable: gameBoardClickable,
                        handlePlaceLetter: handlePlaceSelectedLetter,
                        gameGrid
                    })}
                    {CircleFoundWords({ foundWords })}
                </div>

                <div key={0} className="wordris-row choose-letters">
                    { actuallyPaused ? <div className="paused"></div> : null }
                    {ClickableLetters({
                        clickable: gameState === GameState.ChooseLetter,
                        handleClick: handleLetterClick,
                        selectedIndex: selectedLetterIdx,
                        letters
                    })}
                </div>
    
                <div className="bottom-label">{message}</div>

                <div
                    className="pause-button"
                    onClick={() => setPaused(!paused)}
                >
                    {paused ? "Unpause Game" : "Pause Game"}
                </div>

                {history.length > 0 ? <div className="word-history">{historyDivs}</div> : null}
            </div>
        </>
    )
}