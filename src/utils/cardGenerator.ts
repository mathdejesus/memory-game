import { Card, Difficulty } from '../types/game.types';

/** Grid por dificuldade: linhas × colunas. */
const DIFFICULTY_CONFIG: Record<Difficulty, { rows: number; cols: number }> = {
  easy: { rows: 3, cols: 4 },
  medium: { rows: 4, cols: 4 },
  hard: { rows: 4, cols: 5 },
};

/** Pool de emojis usados como valores das cartas. */
const EMOJIS = [
  '🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🍑', '🥝',
  '🫐', '🥥', '🥭', '🍌', '🍉', '🍍', '🍈', '🌽',
  '🥕', '🥦', '🫑', '🍄', '🌰', '🧄', '🧅', '🥜',
];

/**
 * Gera o baralho de cartas para a dificuldade informada.
 * O número de cartas é sempre par (pares de valores iguais), embaralhado.
 *
 * @param difficulty - nível do jogo ('easy' | 'medium' | 'hard')
 * @returns lista de cartas com estado inicial (todas viradas para baixo)
 *
 * @example
 * generateCards('easy'); // 12 cartas (3×4), 6 pares
 */
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

/**
 * Embaralha um array usando o algoritmo Fisher–Yates (in-place seguro:
 * opera sobre uma cópia, não muta a entrada).
 *
 * @param array - array de entrada
 * @returns novo array embaralhado
 */
export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
