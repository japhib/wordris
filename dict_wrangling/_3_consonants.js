const fs = require('fs');
let lines = fs.readFileSync('../src/dict.txt').toString().split('\n');

// abcdefghijklmnopqrstuvwxyz
// bcd
// fgh
// jklmn
// pqrst
// vwx
// z
function isConsonant(letter) {
  switch (letter) {
    case 'b': return true;
    case 'c': return true;
    case 'd': return true;
    case 'f': return true;
    case 'g': return true;
    case 'h': return true;
    case 'j': return true;
    case 'k': return true;
    case 'l': return true;
    case 'm': return true;
    case 'n': return true;
    case 'p': return true;
    case 'q': return true;
    case 'r': return true;
    case 's': return true;
    case 't': return true;
    case 'v': return true;
    case 'w': return true;
    case 'x': return true;
    case 'z': return true;
  }
  return false;
}

for (const word of lines) {
  let consonantsInARow = 0;
  for (const letter of word) {
    if (isConsonant(letter)) {
      consonantsInARow++;

      if (consonantsInARow >= 3) {
        console.log(word);
      }
    } else {
      consonantsInARow = 0;
    }
  }
}