export type Coords = {
  x: number,
  y: number
}

export type FoundWord = {
  word: string,
  start: Coords,
  end: Coords,
  score: number,
}

// Given a FoundWord, return a list of all the squares that should be highlighted
export function foundWordToCoordsList(foundWord: FoundWord): Coords[] {
  const dx = Math.sign(foundWord.end.x - foundWord.start.x);
  const dy = Math.sign(foundWord.end.y - foundWord.start.y);

  const coordsList: Coords[] = [];
  let curr = { x: foundWord.start.x, y: foundWord.start.y };
  while (true) {
    coordsList.push({
      x: curr.x, y: curr.y
    });

    if (curr.x === foundWord.end.x && curr.y === foundWord.end.y) {
      break;
    }

    curr.x += dx;
    curr.y += dy;
  }

  return coordsList;
}
