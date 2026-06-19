export interface Card {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  position: number;
}

export interface GameState {
  cards: Card[];
  flippedCards: string[];
  matchedPairs: number;
  attempts: number;
  isGameOver: boolean;
  startTime: number;
  difficulty: Difficulty;
  score: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  rows: number;
  cols: number;
  theme: string;
  timeLimit?: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number;
  totalScore: number;
  lastPlayDate: string;
}
