import { useState, useCallback } from 'react';
import { GameState } from '../types/game.types';
import { StorageManager } from '../utils/storageManager';

interface UseGameStateReturn {
  savedGame: GameState | null;
  saveGame: (state: GameState) => Promise<void>;
  loadGame: () => Promise<void>;
  clearSavedGame: () => Promise<void>;
}

export function useGameState(): UseGameStateReturn {
  const [savedGame, setSavedGame] = useState<GameState | null>(null);

  const saveGame = useCallback(async (state: GameState) => {
    await StorageManager.saveGameSnapshot(state);
    setSavedGame(state);
  }, []);

  const loadGame = useCallback(async () => {
    const state = await StorageManager.loadGameSnapshot();
    setSavedGame(state);
  }, []);

  const clearSavedGame = useCallback(async () => {
    await StorageManager.saveGameSnapshot(null as any);
    setSavedGame(null);
  }, []);

  return { savedGame, saveGame, loadGame, clearSavedGame };
}
