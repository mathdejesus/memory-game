import { useState, useCallback } from 'react';
import { GameState } from '../types/game.types';
import { StorageManager } from '../utils/storageManager';

interface UseGameStateReturn {
  savedGame: GameState | null;
  saveGame: (state: GameState) => Promise<void>;
  loadGame: () => Promise<void>;
  clearSavedGame: () => Promise<void>;
}

/**
 * Hook que gerencia o snapshot da partida em andamento (resume game).
 *
 * @returns
 * - `savedGame`: último estado salvo em memória (null se nenhum)
 * - `saveGame`: persiste o estado atual
 * - `loadGame`: carrega o snapshot do AsyncStorage
 * - `clearSavedGame`: remove o snapshot salvo
 */
export function useGameState(): UseGameStateReturn {
  const [savedGame, setSavedGame] = useState<GameState | null>(null);

  /**
   * Persiste o estado da partida e atualiza o cache em memória.
   * Erros de escrita são ignorados silenciosamente (não devem quebrar o jogo).
   */
  const saveGame = useCallback(async (state: GameState) => {
    try {
      await StorageManager.saveGameSnapshot(state);
      setSavedGame(state);
    } catch (err) {
      console.warn('[useGameState] Falha ao salvar partida:', err);
    }
  }, []);

  /** Carrega o snapshot salvo do AsyncStorage para o cache em memória. */
  const loadGame = useCallback(async () => {
    const state = await StorageManager.loadGameSnapshot();
    setSavedGame(state);
  }, []);

  /** Remove o snapshot salvo (define o cache como null). */
  const clearSavedGame = useCallback(async () => {
    try {
      await StorageManager.saveGameSnapshot(null as any);
    } catch (err) {
      console.warn('[useGameState] Falha ao limpar partida:', err);
    }
    setSavedGame(null);
  }, []);

  return { savedGame, saveGame, loadGame, clearSavedGame };
}
