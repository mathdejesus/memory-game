import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, Difficulty } from '../types/game.types';
import { generateCards } from '../utils/cardGenerator';

interface UseGameLogicReturn {
  gameState: GameState;
  handleCardPress: (cardId: string) => void;
  resetGame: () => void;
}

export function useGameLogic(difficulty: Difficulty): UseGameLogicReturn {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(difficulty));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCardPress = useCallback((cardId: string) => {
    setGameState((prev) => {
      if (prev.flippedCards.length === 2) return prev;

      const card = prev.cards.find((c) => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return prev;

      const newFlipped = [...prev.flippedCards, cardId];

      if (newFlipped.length === 2) {
        const [id1, id2] = newFlipped;
        const card1 = prev.cards.find((c) => c.id === id1)!;
        const card2 = prev.cards.find((c) => c.id === id2)!;

        if (card1.value === card2.value) {
          const updated = prev.cards.map((c) =>
            newFlipped.includes(c.id) ? { ...c, isFlipped: true, isMatched: true } : c
          );
          const newMatched = prev.matchedPairs + 1;
          const totalPairs = prev.cards.length / 2;
          const newScore = calculateScore(prev.attempts, newMatched, totalPairs);

          return {
            ...prev,
            cards: updated,
            matchedPairs: newMatched,
            flippedCards: [],
            score: newScore,
            isGameOver: newMatched === totalPairs,
          };
        } else {
          timeoutRef.current = setTimeout(() => {
            setGameState((p) => ({
              ...p,
              cards: p.cards.map((c) =>
                p.flippedCards.includes(c.id) ? { ...c, isFlipped: false } : c
              ),
              flippedCards: [],
            }));
          }, 1000);

          return {
            ...prev,
            cards: prev.cards.map((c) =>
              c.id === cardId ? { ...c, isFlipped: true } : c
            ),
            flippedCards: newFlipped,
            attempts: prev.attempts + 1,
          };
        }
      }

      return {
        ...prev,
        cards: prev.cards.map((c) =>
          c.id === cardId ? { ...c, isFlipped: true } : c
        ),
        flippedCards: newFlipped,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialState(difficulty));
  }, [difficulty]);

  return { gameState, handleCardPress, resetGame };
}

function createInitialState(difficulty: Difficulty): GameState {
  return {
    cards: generateCards(difficulty),
    flippedCards: [],
    matchedPairs: 0,
    attempts: 0,
    isGameOver: false,
    startTime: Date.now(),
    difficulty,
    score: 0,
  };
}

function calculateScore(attempts: number, matched: number, total: number): number {
  const baseScore = matched * 100;
  const attemptPenalty = attempts * 5;
  return Math.max(0, baseScore - attemptPenalty);
}
