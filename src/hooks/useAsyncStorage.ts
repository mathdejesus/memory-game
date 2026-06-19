import { useState, useCallback } from 'react';
import { StorageManager } from '../utils/storageManager';
import { GameStats } from '../types/game.types';

interface UseAsyncStorageReturn {
  stats: GameStats | null;
  loading: boolean;
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

export function useAsyncStorage(): UseAsyncStorageReturn {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(false);

  const saveStats = useCallback(async (newStats: GameStats) => {
    await StorageManager.saveStats(newStats);
    setStats(newStats);
  }, []);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await StorageManager.getStats();
      setStats(data || DEFAULT_STATS);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(async () => {
    await StorageManager.clearAllData();
    setStats(DEFAULT_STATS);
  }, []);

  return { stats, loading, saveStats, loadStats, clearData };
}
