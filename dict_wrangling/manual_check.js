const fs = require('fs');
let lines = fs.readFileSync('../src/dict.txt').toString().split('\n');

console.log(lines);

lines = lines.filter(line => line.length <= 3);
for (const l of lines) {
  console.log(l);
}
