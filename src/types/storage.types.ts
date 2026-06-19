export interface StorageKeys {
  gameStats: string;
  gameSnapshot: string;
  settings: string;
}

export const STORAGE_KEYS: StorageKeys = {
  gameStats: '@memory_game_stats',
  gameSnapshot: '@memory_game_snapshot',
  settings: '@memory_game_settings',
};
