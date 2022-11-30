export const BoardSize = 7;
export const NumLetters = 5;
export const TimerMillis = 3000;

export const SquareSize = '2em';
export const SquareBorderPlusMargin = '6px';

// copied from https://scrabble.hasbro.com/en-us/faq
export const LetterFrequency: { [l: string]: number } = Object.freeze({
  A: 9,
  B: 2,
  C: 2,
  D: 4,
  E: 12,
  F: 2,
  G: 3,
  H: 2,
  I: 9,
  J: 1,
  K: 1,
  L: 4,
  M: 2,
  N: 6,
  O: 8,
  P: 2,
  Q: 1,
  R: 6,
  S: 4,
  T: 6,
  U: 4,
  V: 2,
  W: 2,
  X: 1,
  Y: 2,
  Z: 1
})

export const PointsPerLetter: { [l: string]: number } = Object.freeze({
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 1,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10,
})

export function getScore(word: string) {
  let sum = 0;
  for (const letter of word) {
    sum += PointsPerLetter[letter];
  }
  return sum;
}

export function shuffleLetters() {
  const letters = [];
  for (const letter in LetterFrequency) {
    const freq = LetterFrequency[letter];
    for (let i = 0; i < freq; i++) {
      letters.push(letter);
    }
  }
  shuffle(letters);
  return letters;
}

// From: https://stackoverflow.com/a/2450976/530728
function shuffle<T>(array: T[]) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}