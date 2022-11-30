import { describe, it, assert } from 'vitest';
import GameGrid from '../src/GameGrid';

describe('GameGrid', () => {
  it('finds no words initially', () => {
    const grid = new GameGrid();

    const words = grid.findWords();
    assert.deepEqual(words, []);
  })
  
  it('finds a short word going down', () => {
    const grid = new GameGrid();

    grid.placeLetter('A', 0);
    grid.placeLetter('E', 0);
    grid.placeLetter('T', 0);

    const words = grid.findWords();
    assert.equal(words.length, 1);
    assert.equal(words[0].word, 'TEA');
  })

  it('finds a long word going down', () => {
    const grid = new GameGrid();

    // JAGUAR
    grid.placeLetter('R', 0);
    grid.placeLetter('A', 0);
    grid.placeLetter('U', 0);
    grid.placeLetter('G', 0);
    grid.placeLetter('A', 0);
    grid.placeLetter('J', 0);

    const words = grid.findWords();
    assert.equal(words.length, 1);
    assert.equal(words[0].word, 'JAGUAR');
  })

  it('finds a short word going left to right', () => {
    const grid = new GameGrid();

    grid.placeLetter('T', 0);
    grid.placeLetter('E', 1);
    grid.placeLetter('A', 2);

    const words = grid.findWords();
    assert.equal(words.length, 1);
    assert.equal(words[0].word, 'TEA');
  })

  it('finds a short word going up', () => {
    const grid = new GameGrid();

    grid.placeLetter('T', 0);
    grid.placeLetter('E', 0);
    grid.placeLetter('A', 0);

    const words = grid.findWords();
    assert.equal(words.length, 1);
    assert.equal(words[0].word, 'TEA');
  })

  it('finds two words at once', () => {
    const grid = new GameGrid();

    // MELT and TEA
    grid.placeLetter('M', 0);
    grid.placeLetter('E', 1);
    grid.placeLetter('L', 2);

    grid.placeLetter('E', 4);
    grid.placeLetter('A', 5);

    // no words should be found
    let words = grid.findWords();
    assert.deepEqual(words, []);

    // Place the final letter
    grid.placeLetter('T', 3);
    
    // two words should be found
    words = grid.findWords();
    assert.equal(words.length, 2);
    assert.equal(words[0].word, 'MELT');
    assert.equal(words[1].word, 'TEA');
  })

  it('does not find a word contained in another word', () => {
    const grid = new GameGrid();

    grid.placeLetter('M', 0);
    grid.placeLetter('E', 1);

    grid.placeLetter('T', 3);

    // no words should be found
    let words = grid.findWords();
    assert.deepEqual(words, []);

    // Place the final letter
    grid.placeLetter('A', 2);
    
    // one word should be found. (MEAT not EAT)
    words = grid.findWords();
    assert.equal(words.length, 1);
    assert.equal(words[0].word, 'MEAT');
  })
})