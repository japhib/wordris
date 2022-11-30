import { BoardSize, getScore } from "./Constants";
import { isWord } from "./Dictionary";
import { Coords, FoundWord, foundWordContainsOther, foundWordToCoordsList } from "./Types";

export type GridCellContents = string | null;

export default class GameGrid {
  grid: GridCellContents[][];

  constructor() {
    // create grid
    this.grid = [];
    for (let y = 0; y < BoardSize; y++) {
      let row = [];
      for (let x = 0; x < BoardSize; x++) {
        row.push(null);
      }
      this.grid.push(row);
    }
  }

  placeLetter(letter: string, column: number): boolean {
    const space = this.getOpenSpaceInColumn(column);
    if (space) {
      this.set(space, letter);
      return true;
    } else {
      return false;
    }
  }

  getOpenSpaceInColumn(column: number): Coords | null {
    // start from the bottom of the column, go up until we find an empty square
    for (let row = BoardSize - 1; row >= 0; row--) {
      const square = this.grid[row][column];
      if (square === null) {
        // It's empty, insert here and break
        return { x: column, y: row };
      }
    }

    // no empty squares -- couldn't insert it!
    return null;
  }

  get(coords: Coords): GridCellContents {
    return this.grid[coords.y][coords.x];
  }

  set(coords: Coords, value: GridCellContents) {
    this.grid[coords.y][coords.x] = value;
  }

  print() {
    for (let y = 0; y < BoardSize; y++) {
      let row = '';
      for (let x = 0; x < BoardSize; x++) {
        if (x > 0) row += '|';
        const contents = this.grid[y][x];
        row += contents || ' ';
      }
      console.log(row);
    }
  }

  findWords() {
    const wordsFound: FoundWord[] = [];

    for (let y = 0; y < BoardSize; y++) {
      for (let x = 0; x < BoardSize; x++) {
        const startingLetter = this.grid[y][x];
        if (!startingLetter) continue;

        // Right/down get extra score bump -- this is a directional bias so it
        // finds words going right/down before words that go up.
        //
        // right
        this.checkWords(x, y, 1, 0, wordsFound, .2);
        // down
        this.checkWords(x, y, 0, 1, wordsFound, .1);
        // up
        this.checkWords(x, y, 0, -1, wordsFound);
      }
    }

    if (wordsFound.length > 0)
      return this.massageFoundWords(wordsFound);

    return wordsFound;
  }

  private checkWords(x: number, y: number, dx: number, dy: number, wordsFound: FoundWord[], scoreBias?: number) {
    scoreBias = scoreBias || 0;

    let word = '';
    for (let i = 0;
      // ensure (x + (i*dx), y + (i*dy)) is always in the board's bounds
      x + (i*dx) < BoardSize
        && x + (i*dx) >= 0
        && y + (i*dy) < BoardSize
        && y + (i*dy) >= 0; i++) {
      
      const newLetter = this.grid[y + (i*dy)][x + (i*dx)];
      if (!newLetter) break;

      word += newLetter;

      if (isWord(word)) {
        wordsFound.push({
          start: { x, y },
          end: { x: x + (i*dx), y: y + (i*dy) },
          score: getScore(word) + scoreBias,
          word
        });
      }
    }
  }

  // Removes any words that are contained by other, higher-scoring words.
  private massageFoundWords(words: FoundWord[]): FoundWord[] {
    const massaged: FoundWord[] = [];
    words.sort((wordA, wordB) => Math.sign(wordB.score - wordA.score));
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

  clearWords(words: FoundWord[]) {
    for (const word of words) {
      this.clearWord(word);
    }
  }

  clearWord(word: FoundWord) {
    const squares = foundWordToCoordsList(word);
    for (const sq of squares) {
      this.grid[sq.y][sq.x] = null;
    }

    // resolve empty cells by pushing stuff down
    for (let x = 0; x < BoardSize; x++) {
      // start at the bottom
      for (let y = BoardSize - 1; y >= 0; y--) {
        if (this.grid[y][x] === null) {
          // shift everything down 1
          for (let i = y; i > 0; i--) {
            this.grid[i][x] = this.grid[i-1][x];
          }
          // top space must be empty
          this.grid[0][x] = null;
        }
      }
    }
  }

  getRandomNonFullColumn() {
    const columns = [];
    for (let i = 0; i < BoardSize; i++) {
      // If top cell is empty, column is okay
      if (!this.grid[0][i])
        columns.push(i);
    }
    return columns[Math.floor(Math.random() * columns.length)];
  }
}
