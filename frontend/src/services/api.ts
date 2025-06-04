import { CrosswordGrid, Direction } from '../types/crossword';

export interface WordPlacementAPI {
  word: string;
  start_row: number;
  start_col: number;
  direction: string;
  number: number;
}

export interface CrosswordResponseAPI {
  grid: (string | null)[][];
  width: number;
  height: number;
  word_placements: WordPlacementAPI[];
  success: boolean;
  message: string;
}

export interface WordListRequest {
  words: string[];
}

export interface TopicRequest {
  topic: string;
}

export interface TopicWordsResponse {
  words: string[];
  topic: string;
  success: boolean;
  message: string;
}

const API_BASE_URL = 'http://localhost:8000';

export class CrosswordAPI {
  static async generateCrossword(words: string[]): Promise<CrosswordGrid> {
    const response = await fetch(`${API_BASE_URL}/generate-crossword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ words }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data: CrosswordResponseAPI = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    // Convert API response to frontend format
    const crosswordGrid: CrosswordGrid = {
      grid: data.grid,
      width: data.width,
      height: data.height,
      word_placements: data.word_placements.map(placement => ({
        word: placement.word,
        start_row: placement.start_row,
        start_col: placement.start_col,
        direction: placement.direction === 'horizontal' ? Direction.HORIZONTAL : Direction.VERTICAL,
        number: placement.number
      }))
    };

    return crosswordGrid;
  }

  static async generateWordsFromTopic(topic: string): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/generate-from-topic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data: TopicWordsResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.words;
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}