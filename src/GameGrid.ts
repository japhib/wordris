import { BoardSize } from "./Constants";

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
    // start from the bottom of the column, go up until we find an empty square
    for (let row = BoardSize - 1; row >= 0; row--) {
      const square = this.grid[row][column];
      if (square === null) {
        // It's empty, insert here and break
        this.grid[row][column] = letter;
        return true;
      }
    }

    // no empty squares -- couldn't insert it!
    return false;
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
}
