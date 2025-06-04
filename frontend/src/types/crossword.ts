export enum Direction {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical"
}

export interface WordPlacement {
  word: string;
  start_row: number;
  start_col: number;
  direction: Direction;
  clue?: string;
  number?: number;
}

export interface CrosswordGrid {
  grid: (string | null)[][];
  width: number;
  height: number;
  word_placements: WordPlacement[];
}

export interface CrosswordClue {
  number: number;
  word: string;
  direction: Direction;
  clue: string;
}

export interface CellState {
  letter: string;
  isHighlighted: boolean;
  isActive: boolean;
  number?: number;
}