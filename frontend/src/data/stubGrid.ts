import { CrosswordGrid, Direction } from '../types/crossword';

// Stub grid based on a typical crossword output for testing
export const stubGrid: CrosswordGrid = {
  grid: [
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, 'C', null, null, null, null, null, null],
    [null, null, null, null, 'P', 'Y', 'T', 'H', 'O', 'N', null, null, null, null, null],
    [null, null, 'M', null, 'L', null, 'E', null, 'D', null, null, null, null, null, null],
    [null, 'D', 'A', 'T', 'A', null, 'S', null, 'E', null, null, null, null, null, null],
    [null, null, 'G', null, 'C', null, 'T', null, null, null, null, null, null, null, null],
    [null, null, 'I', null, 'E', null, null, null, null, null, null, null, null, null, null],
    [null, null, 'C', null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  ],
  width: 15,
  height: 15,
  word_placements: [
    { word: 'PYTHON', start_row: 7, start_col: 4, direction: Direction.HORIZONTAL, number: 1 },
    { word: 'CODE', start_row: 6, start_col: 8, direction: Direction.VERTICAL, number: 2 },
    { word: 'TEST', start_row: 7, start_col: 6, direction: Direction.VERTICAL, number: 3 },
    { word: 'PLACE', start_row: 7, start_col: 4, direction: Direction.VERTICAL, number: 4 },
    { word: 'DATA', start_row: 9, start_col: 1, direction: Direction.HORIZONTAL, number: 5 },
    { word: 'MAGIC', start_row: 8, start_col: 2, direction: Direction.VERTICAL, number: 6 }
  ]
};