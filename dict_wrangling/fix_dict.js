const fs = require('fs');
let lines = fs.readFileSync('en_US.dic').toString().split('\n');

// cut off first line (52890)
lines = lines.slice(1);

// remove lines WITHOUT any numbers because those are probably all abbreviations
lines = lines.filter(line => line.match(/[0-9]/))

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

// length must be 3-7
lines = lines.filter(line => line.length >= 3 && line.length <= 7);

// remove duplicates
const uniq = [...new Set(lines)];
lines = Array.from(uniq);
lines.sort();

// write to file
fs.writeFileSync('../src/dict.txt', lines.join('\n'));
