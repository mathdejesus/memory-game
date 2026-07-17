import { useState, useCallback } from 'react';
import { StorageManager } from '../utils/storageManager';
import { GameStats } from '../types/game.types';

interface UseAsyncStorageReturn {
  stats: GameStats | null;
  loading: boolean;
  error: Error | null;
  saveStats: (stats: GameStats) => Promise<void>;
  loadStats: () => Promise<void>;
  clearData: () => Promise<void>;
}

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTime: 0,
  totalScore: 0,
  lastPlayDate: '',
};

/**
 * Hook que abstrai a leitura/escrita de estatísticas no AsyncStorage.
 * - `loadStats` e `saveStats` nunca quebram a UI: erros são expostos via `error`.
 * - `clearData` propaga o erro via throw para que a tela possa alertar o usuário.
 */
export function useAsyncStorage(): UseAsyncStorageReturn {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveStats = useCallback(async (newStats: GameStats) => {
    try {
      await StorageManager.saveStats(newStats);
      setStats(newStats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Falha ao salvar'));
    }
  }, []);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await StorageManager.getStats();
      setStats(data || DEFAULT_STATS);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Falha ao carregar'));
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(async () => {
    await StorageManager.clearAllData();
    setStats(DEFAULT_STATS);
    setError(null);
  }, []);

  return { stats, loading, error, saveStats, loadStats, clearData };
}
