import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameState } from '../types/game.types';

// Helper: monta o hook num componente de teste e expõe o estado/handlers.
function setup(difficulty: 'easy' | 'medium' | 'hard' = 'easy') {
  const api: {
    state: GameState | null;
    press: ((id: string) => void) | null;
    reset: (() => void) | null;
  } = { state: null, press: null, reset: null };

  function Harness() {
    const { gameState, handleCardPress, resetGame } = useGameLogic(difficulty);
    api.state = gameState;
    api.press = handleCardPress;
    api.reset = resetGame;
    return null;
  }

  let renderer: TestRenderer.ReactTestRenderer;
  TestRenderer.act(() => {
    renderer = TestRenderer.create(<Harness />);
  });
  return { api, renderer: renderer! };
}

/** Encontra um par de cartas com o mesmo valor e retorna seus ids. */
function findMatchingPair(state: GameState): [string, string] {
  const byValue = new Map<string, string>();
  for (const c of state.cards) {
    if (byValue.has(c.value)) return [byValue.get(c.value)!, c.id];
    byValue.set(c.value, c.id);
  }
  throw new Error('nenhum par encontrado');
}

/** Encontra duas cartas com valores diferentes. */
function findMismatchingPair(state: GameState): [string, string] {
  const first = state.cards[0];
  const other = state.cards.find((c) => c.value !== first.value)!;
  return [first.id, other.id];
}

describe('useGameLogic', () => {
  it('inicializa com o número correto de cartas para a dificuldade', () => {
    const { api, renderer } = setup('medium');
    expect(api.state!.cards).toHaveLength(16);
    expect(api.state!.matchedPairs).toBe(0);
    expect(api.state!.attempts).toBe(0);
    expect(api.state!.isGameOver).toBe(false);
    renderer.unmount();
  });

  it('vira uma carta ao pressionar', () => {
    const { api, renderer } = setup();
    const firstId = api.state!.cards[0].id;
    act(() => api.press!(firstId));
    expect(api.state!.cards[0].isFlipped).toBe(true);
    expect(api.state!.flippedCards).toEqual([firstId]);
    renderer.unmount();
  });

  it('marca match quando dois valores iguais são virados', () => {
    const { api, renderer } = setup();
    const [id1, id2] = findMatchingPair(api.state!);
    act(() => api.press!(id1));
    act(() => api.press!(id2));
    const c1 = api.state!.cards.find((c) => c.id === id1)!;
    const c2 = api.state!.cards.find((c) => c.id === id2)!;
    expect(c1.isMatched).toBe(true);
    expect(c2.isMatched).toBe(true);
    expect(api.state!.matchedPairs).toBe(1);
    expect(api.state!.flippedCards).toHaveLength(0);
    renderer.unmount();
  });

  it('incrementa tentativas e desvira em caso de mismatch (após timeout)', () => {
    jest.useFakeTimers();
    const { api, renderer } = setup();
    const [id1, id2] = findMismatchingPair(api.state!);
    act(() => api.press!(id1));
    act(() => api.press!(id2));
    expect(api.state!.attempts).toBe(1);
    expect(api.state!.flippedCards).toHaveLength(2);
    expect(api.state!.cards.find((c) => c.id === id1)!.isFlipped).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(api.state!.cards.find((c) => c.id === id1)!.isFlipped).toBe(false);
    expect(api.state!.cards.find((c) => c.id === id2)!.isFlipped).toBe(false);
    expect(api.state!.flippedCards).toHaveLength(0);
    jest.useRealTimers();
    renderer.unmount();
  });

  it('limpa o timeout pendente ao desmontar (sem vazar timer)', () => {
    jest.useFakeTimers();
    const { api, renderer } = setup();
    const [id1, id2] = findMismatchingPair(api.state!);
    act(() => api.press!(id1));
    act(() => api.press!(id2));
    act(() => renderer.unmount());
    // Se o cleanup não funcionasse, avançar o timer tentaria setGameState num
    // componente desmontado. Aqui validamos que não lança.
    expect(() => jest.advanceTimersByTime(1000)).not.toThrow();
    jest.useRealTimers();
  });

  it('bloqueia terceira carta enquanto duas estão viradas', () => {
    const { api, renderer } = setup();
    const [id1, id2] = findMismatchingPair(api.state!);
    act(() => api.press!(id1));
    act(() => api.press!(id2));
    const third = api.state!.cards.find((c) => c.id !== id1 && c.id !== id2)!;
    act(() => api.press!(third.id));
    expect(api.state!.flippedCards).toHaveLength(2);
    renderer.unmount();
  });

  it('resetGame restaura o estado inicial', () => {
    const { api, renderer } = setup();
    const [id1, id2] = findMatchingPair(api.state!);
    act(() => api.press!(id1));
    act(() => api.press!(id2));
    expect(api.state!.matchedPairs).toBe(1);
    act(() => api.reset!());
    expect(api.state!.matchedPairs).toBe(0);
    expect(api.state!.attempts).toBe(0);
    expect(api.state!.cards.every((c) => !c.isMatched && !c.isFlipped)).toBe(true);
    renderer.unmount();
  });

  it('detecta game over quando todos os pares são encontrados', () => {
    const { api, renderer } = setup();
    let guard = 0;
    while (!api.state!.isGameOver && guard < 50) {
      const remaining = api.state!.cards.filter((c) => !c.isMatched);
      const byValue = new Map<string, string>();
      let pair: [string, string] | null = null;
      for (const c of remaining) {
        if (byValue.has(c.value)) {
          pair = [byValue.get(c.value)!, c.id];
          break;
        }
        byValue.set(c.value, c.id);
      }
      if (!pair) break;
      act(() => api.press!(pair![0]));
      act(() => api.press!(pair![1]));
      guard++;
    }
    expect(api.state!.isGameOver).toBe(true);
    expect(api.state!.matchedPairs).toBe(api.state!.cards.length / 2);
    renderer.unmount();
  });
});
