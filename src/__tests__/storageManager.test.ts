import { StorageManager } from '../utils/storageManager';
import { GameStats, GameState } from '../types/game.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

function baseStats(partial: Partial<GameStats> = {}): GameStats {
  return {
    gamesPlayed: 3,
    gamesWon: 2,
    bestTime: 42,
    totalScore: 350,
    lastPlayDate: '2026-01-01T00:00:00.000Z',
    ...partial,
  };
}

function validState(partial: Partial<GameState> = {}): GameState {
  return {
    cards: [
      { id: 'card-0', value: '🍎', isFlipped: false, isMatched: true, position: 0 },
      { id: 'card-1', value: '🍎', isFlipped: false, isMatched: true, position: 1 },
    ],
    flippedCards: [],
    matchedPairs: 1,
    attempts: 1,
    isGameOver: false,
    startTime: 1000,
    difficulty: 'easy',
    score: 95,
    ...partial,
  };
}

describe('StorageManager', () => {
  it('salva e lê estatísticas corretamente', async () => {
    await StorageManager.saveStats(baseStats());
    const loaded = await StorageManager.getStats();
    expect(loaded).toEqual(baseStats());
  });

  it('getStats retorna null quando não há dados', async () => {
    expect(await StorageManager.getStats()).toBeNull();
  });

  it('getStats retorna null se o JSON estiver corrompido (não quebra)', async () => {
    await AsyncStorage.setItem('@memory_game_stats', '{invalid json');
    expect(await StorageManager.getStats()).toBeNull();
  });

  it('normaliza estatísticas com campos ausentes', async () => {
    await AsyncStorage.setItem(
      '@memory_game_stats',
      JSON.stringify({ gamesPlayed: 1 })
    );
    const loaded = await StorageManager.getStats();
    expect(loaded).toEqual({
      gamesPlayed: 1,
      gamesWon: 0,
      bestTime: 0,
      totalScore: 0,
      lastPlayDate: '',
    });
  });

  it('rejeita estatísticas inconsistentes (vitorias > jogadas)', async () => {
    await AsyncStorage.setItem(
      '@memory_game_stats',
      JSON.stringify({ gamesPlayed: 1, gamesWon: 5 })
    );
    expect(await StorageManager.getStats()).toBeNull();
  });

  it('saveGameSnapshot + loadGameSnapshot round-trip', async () => {
    const state = validState();
    await StorageManager.saveGameSnapshot(state);
    expect(await StorageManager.loadGameSnapshot()).toEqual(state);
  });

  it('loadGameSnapshot valida dificuldade inválida -> null', async () => {
    await AsyncStorage.setItem(
      '@memory_game_snapshot',
      JSON.stringify({ ...validState(), difficulty: 'impossible' })
    );
    expect(await StorageManager.loadGameSnapshot()).toBeNull();
  });

  it('loadGameSnapshot exige array de cartas -> null se vazio', async () => {
    await AsyncStorage.setItem(
      '@memory_game_snapshot',
      JSON.stringify({ ...validState(), cards: [] })
    );
    expect(await StorageManager.loadGameSnapshot()).toBeNull();
  });

  it('clearAllData remove todas as chaves', async () => {
    await StorageManager.saveStats(baseStats());
    await StorageManager.saveGameSnapshot(validState());
    await StorageManager.clearAllData();
    expect(await StorageManager.getStats()).toBeNull();
    expect(await StorageManager.loadGameSnapshot()).toBeNull();
  });

  it('saveStats lança StorageError quando o AsyncStorage falha', async () => {
    const spy = jest
      .spyOn(AsyncStorage, 'setItem')
      .mockRejectedValueOnce(new Error('IO error'));
    await expect(StorageManager.saveStats(baseStats())).rejects.toMatchObject({
      name: 'StorageError',
    });
    spy.mockRestore();
  });
});
