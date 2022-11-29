const fs = require('fs');
let lines = fs.readFileSync('en_US.dic').toString().split('\n');

// cut off first line (52890)
lines = lines.slice(1);

// remove any lines with capital letters
const capitalLetterRegex = /[A-Z']/;
lines = lines.filter(line => !line.match(capitalLetterRegex));

// remove extra gunk on the end of the word
const fixupRegex = /(\w+).*/;
lines = lines.map(line => {
  const result = fixupRegex.exec(line);
  return !!result ? result[1] : line;
})

// remove words with numbers
lines = lines.filter(line => !line.match(/[0-9]/))

// remove words 2 letters or less
lines = lines.filter(line => line.length >= 3);

console.log(lines);

// write to file
fs.writeFileSync('../src/dict.txt', lines.join('\n'));
