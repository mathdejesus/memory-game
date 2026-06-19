import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '../types/game.types';
import { GameStats } from '../types/game.types';
import { STORAGE_KEYS } from '../types/storage.types';

export class StorageManager {
  static async saveStats(stats: GameStats): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.gameStats, JSON.stringify(stats));
  }

  static async getStats(): Promise<GameStats | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.gameStats);
    return data ? JSON.parse(data) : null;
  }

  static async saveGameSnapshot(state: GameState): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.gameSnapshot, JSON.stringify(state));
  }

  static async loadGameSnapshot(): Promise<GameState | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.gameSnapshot);
    return data ? JSON.parse(data) : null;
  }

  static async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.gameStats,
      STORAGE_KEYS.gameSnapshot,
      STORAGE_KEYS.settings,
    ]);
  }
}
