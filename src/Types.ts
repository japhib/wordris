export type Coords = {
  x: number,
  y: number
}

export type Bounds = {
  start: Coords,
  end: Coords
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

// function normalizeBounds(bounds: Bounds): Bounds {
//   const ret = {
//     start: { x: bounds.start.x, y: bounds.start.y },
//     end: { x: bounds.end.x, y: bounds.end.y }
//   }

//   // If X's are opposite, swap them
//   if (ret.end.x < ret.start.x) {
//     [ret.start.x, ret.end.x] = [ret.end.x, ret.start.x];
//   }

//   // If Y's are opposite, swap them
//   if (ret.end.y < ret.start.y) {
//     [ret.start.y, ret.end.y] = [ret.end.y, ret.start.y];
//   }

//   return ret;
// }

export function foundWordContainsOther(outer: FoundWord, inner: FoundWord): boolean {
  return inner.start.x <= outer.start.x
    && inner.end.x >= outer.end.x
    && inner.start.y <= outer.start.y
    && inner.end.y >= outer.end.y;
}
