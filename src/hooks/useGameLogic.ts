import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, Difficulty } from '../types/game.types';
import { generateCards } from '../utils/cardGenerator';
import { calculateScore } from '../utils/gameEngine';

interface UseGameLogicReturn {
  gameState: GameState;
  handleCardPress: (cardId: string) => void;
  resetGame: () => void;
}

const FLIP_BACK_DELAY = 1000;

export function useGameLogic(difficulty: Difficulty): UseGameLogicReturn {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(difficulty));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Limpa o timeout pendente se o hook desmontar (ex.: usuário volta ao menu
  // antes dos 1s de delay). Sem isso, o setGameState dispararia num componente
  // desmontado e vazaria o timer.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
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
          // Captura os IDs agora para usar no callback — evita depender de
          // prev.flippedCards, que pode ter sido esvaziado por outra atualização.
          const idsToFlipBack = newFlipped;
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setGameState((p) => ({
              ...p,
              cards: p.cards.map((c) =>
                idsToFlipBack.includes(c.id) ? { ...c, isFlipped: false } : c
              ),
              flippedCards: [],
            }));
            timeoutRef.current = null;
          }, FLIP_BACK_DELAY);

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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
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
