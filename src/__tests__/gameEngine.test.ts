import {
  calculateScore,
  isMatch,
  isGameComplete,
  getElapsedSeconds,
} from '../utils/gameEngine';
import { Card } from '../types/game.types';

function makeCard(value: string, partial: Partial<Card> = {}): Card {
  return {
    id: `card-${Math.random()}`,
    value,
    isFlipped: false,
    isMatched: false,
    position: 0,
    ...partial,
  };
}

describe('gameEngine', () => {
  describe('calculateScore', () => {
    it('pontua pares sem penalidade quando não há tentativas', () => {
      expect(calculateScore(0, 6, 6)).toBe(600);
    });

    it('aplica penalidade de 5 por tentativa', () => {
      expect(calculateScore(2, 6, 6)).toBe(590);
    });

    it('nunca retorna valor negativo', () => {
      expect(calculateScore(1000, 0, 6)).toBe(0);
    });

    it('considera o total de pares corretamente (mesmo se não completou)', () => {
      expect(calculateScore(1, 3, 6)).toBe(295);
    });
  });

  describe('isMatch', () => {
    it('retorna true para valores iguais', () => {
      expect(isMatch(makeCard('🍎'), makeCard('🍎'))).toBe(true);
    });
    it('retorna false para valores diferentes', () => {
      expect(isMatch(makeCard('🍎'), makeCard('🍊'))).toBe(false);
    });
  });

  describe('isGameComplete', () => {
    it('true quando todos os pares encontrados', () => {
      expect(isGameComplete(6, 6)).toBe(true);
    });
    it('false antes de completar', () => {
      expect(isGameComplete(5, 6)).toBe(false);
    });
  });

  describe('getElapsedSeconds', () => {
    it('calcula segundos inteiros decorridos', () => {
      const start = 1000;
      expect(getElapsedSeconds(start, start + 5500)).toBe(5);
    });
    it('não retorna valor negativo se o relógio recuar', () => {
      const start = 10000;
      expect(getElapsedSeconds(start, start - 5000)).toBe(0);
    });
  });
});
