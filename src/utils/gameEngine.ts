import { Card } from '../types/game.types';

export class GameEngine {
  private cards: Card[];

  constructor(cards: Card[]) {
    this.cards = cards;
  }

  isMatch(card1: Card, card2: Card): boolean {
    return card1.value === card2.value;
  }

  flipCard(cardId: string): Card[] {
    return this.cards.map((card) =>
      card.id === cardId ? { ...card, isFlipped: !card.isFlipped } : card
    );
  }

  markMatched(cardIds: string[]): Card[] {
    return this.cards.map((card) =>
      cardIds.includes(card.id) ? { ...card, isMatched: true } : card
    );
  }

  calculateScore(attempts: number, matched: number, total: number): number {
    const baseScore = matched * 100;
    const attemptPenalty = attempts * 5;
    return Math.max(0, baseScore - attemptPenalty);
  }

  isGameComplete(): boolean {
    return this.cards.every((card) => card.isMatched);
  }

  updateCards(cards: Card[]): void {
    this.cards = cards;
  }
}
