import { BoardSize, getScore } from "./Constants";
import { isWord } from "./Dictionary";
import { Coords, FoundWord, foundWordToCoordsList } from "./Types";

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

  placeLetter(letter: string, column: number): Coords | null {
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

        // right
        this.checkWords(x, y, 1, 0, wordsFound, .2);
        // down
        this.checkWords(x, y, 0, 1, wordsFound, .1);
        // up
        this.checkWords(x, y, 0, -1, wordsFound);
      }
    }

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
}
