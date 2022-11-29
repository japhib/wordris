import wordList from './dict.txt?raw';

// TODO make this more efficient. Right now it's still O(log n) b/c binary search on sorted list, but could be a lot faster.

const words = wordList.split('\n').sort().map(word => word.toUpperCase());

export function isWord(word: string): boolean {

  let beginIdx = 0;
  let endIdx = words.length;

  let lastIdx = null;
  while (true) {
    const middleIdx = Math.floor((beginIdx + endIdx) / 2);
    if (lastIdx === middleIdx) {
      return false;
    }
    lastIdx = middleIdx;

    const wordToCompareWith = words[middleIdx];

    if (word === wordToCompareWith) {
      // found it!
      return true;
    } else if (word < wordToCompareWith) {
      endIdx = middleIdx;
    } else {
      beginIdx = middleIdx;
    }
  }
}
