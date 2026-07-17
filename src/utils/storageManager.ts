import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, GameState, GameStats, Difficulty } from '../types/game.types';
import { STORAGE_KEYS } from '../types/storage.types';

/**
 * Erro customizado para falhas de persistência/validação.
 * Permite que a UI distinga "sem dados" de "dados corrompidos".
 */
export class StorageError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}

const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

/** Verifica se o valor é um número finito e >= 0. */
function isNonNegativeNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0;
}

/**
 * Valida a estrutura de GameStats e normaliza campos ausentes/corrompidos.
 * Nunca lança — retorna null se o objeto for irrecuperável.
 */
function validateGameStats(raw: unknown): GameStats | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  const gamesPlayed = isNonNegativeNumber(r.gamesPlayed) ? r.gamesPlayed : 0;
  const gamesWon = isNonNegativeNumber(r.gamesWon) ? r.gamesWon : 0;
  const bestTime = isNonNegativeNumber(r.bestTime) ? r.bestTime : 0;
  const totalScore = isNonNegativeNumber(r.totalScore) ? r.totalScore : 0;
  const lastPlayDate = typeof r.lastPlayDate === 'string' ? r.lastPlayDate : '';

  // Consistência: partidas vencidas não podem exceder jogadas.
  if (gamesWon > gamesPlayed) return null;

  return { gamesPlayed, gamesWon, bestTime, totalScore, lastPlayDate };
}

/**
 * Valida a estrutura de GameState salvo.
 * Garante que cards, flippedCards e dificuldade existam e sejam coerentes.
 */
function validateGameSnapshot(raw: unknown): GameState | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  if (!Array.isArray(r.cards) || r.cards.length === 0) return null;
  const cards = r.cards.filter(
    (c): c is Card =>
      !!c &&
      typeof c === 'object' &&
      typeof (c as Card).id === 'string' &&
      typeof (c as Card).value === 'string'
  );
  if (cards.length !== r.cards.length) return null;

  if (!Array.isArray(r.flippedCards)) return null;
  if (typeof r.difficulty !== 'string' || !VALID_DIFFICULTIES.includes(r.difficulty as Difficulty)) {
    return null;
  }

  const matchedPairs = isNonNegativeNumber(r.matchedPairs) ? r.matchedPairs : 0;
  const attempts = isNonNegativeNumber(r.attempts) ? r.attempts : 0;
  const score = isNonNegativeNumber(r.score) ? r.score : 0;
  const startTime = isNonNegativeNumber(r.startTime) ? r.startTime : Date.now();
  const isGameOver = typeof r.isGameOver === 'boolean' ? r.isGameOver : false;

  return {
    cards,
    flippedCards: r.flippedCards,
    matchedPairs,
    attempts,
    isGameOver,
    startTime,
    difficulty: r.difficulty as Difficulty,
    score,
  };
}

/**
 * Encapsula toda a persistência em AsyncStorage com tratamento de erro.
 * Métodos de leitura nunca lançam: retornam null em caso de falha/corrupção.
 * Métodos de escrita lançam StorageError em caso de falha.
 */
export class StorageManager {
  /** Salva as estatísticas do jogador. Lança StorageError em falha. */
  static async saveStats(stats: GameStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.gameStats, JSON.stringify(stats));
    } catch (err) {
      throw new StorageError('Falha ao salvar estatísticas', err);
    }
  }

  /** Lê as estatísticas. Retorna null se vazio, corrompido ou com erro. */
  static async getStats(): Promise<GameStats | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.gameStats);
      if (!data) return null;
      return validateGameStats(JSON.parse(data));
    } catch (err) {
      // JSON malformado ou erro de IO: trata como "sem dados" para não quebrar o app.
      console.warn('[StorageManager] getStats falhou, retornando null:', err);
      return null;
    }
  }

  /** Salva o snapshot da partida em andamento. Lança StorageError em falha. */
  static async saveGameSnapshot(state: GameState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.gameSnapshot, JSON.stringify(state));
    } catch (err) {
      throw new StorageError('Falha ao salvar snapshot do jogo', err);
    }
  }

  /** Lê o snapshot da partida. Retorna null se vazio, corrompido ou com erro. */
  static async loadGameSnapshot(): Promise<GameState | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.gameSnapshot);
      if (!data) return null;
      return validateGameSnapshot(JSON.parse(data));
    } catch (err) {
      console.warn('[StorageManager] loadGameSnapshot falhou, retornando null:', err);
      return null;
    }
  }

  /** Remove todas as chaves de dados do jogo. Lança StorageError em falha. */
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.gameStats,
        STORAGE_KEYS.gameSnapshot,
        STORAGE_KEYS.settings,
      ]);
    } catch (err) {
      throw new StorageError('Falha ao limpar dados', err);
    }
  }
}
