import { Card, Difficulty } from '../types/game.types';

const DIFFICULTY_CONFIG: Record<Difficulty, { rows: number; cols: number }> = {
  easy: { rows: 3, cols: 4 },
  medium: { rows: 4, cols: 4 },
  hard: { rows: 4, cols: 5 },
};

const EMOJIS = [
  '🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🍑', '🥝',
  '🫐', '🥥', '🥭', '🍌', '🍉', '🍍', '🍈', '🌽',
  '🥕', '🥦', '🫑', '🍄', '🌰', '🧄', '🧅', '🥜',
];

export function generateCards(difficulty: Difficulty): Card[] {
  const config = DIFFICULTY_CONFIG[difficulty];
  const totalCards = config.rows * config.cols;
  const pairCount = totalCards / 2;

  const selected = shuffle(EMOJIS).slice(0, pairCount);

  const paired = [...selected, ...selected];
  const shuffled = shuffle(paired);

  return shuffled.map((value, index) => ({
    id: `card-${index}`,
    value,
    isFlipped: false,
    isMatched: false,
    position: index,
  }));
}

export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
