import { Card, GameState } from '../types/game.types';

/**
 * Motor de regras do jogo da memória.
 * Centraliza a lógica pura de pontuação e verificação de fim de jogo,
 * desacoplada de React para facilitar testes unitários.
 */

/**
 * Calcula a pontuação de uma partida.
 *
 * @param attempts - número de tentativas (pares revelados que não deram match imediato contam como 1)
 * @param matchedPairs - quantidade de pares já encontrados
 * @param totalPairs - quantidade total de pares no tabuleiro
 * @returns pontuação final (nunca negativa)
 *
 * @example
 * calculateScore(2, 6, 6); // 600 - 10 = 590
 */
export function calculateScore(
  attempts: number,
  matchedPairs: number,
  totalPairs: number
): number {
  const baseScore = matchedPairs * 100;
  const attemptPenalty = attempts * 5;
  return Math.max(0, baseScore - attemptPenalty);
}

/**
 * Verifica se duas cartas formam um par (mesmo valor).
 *
 * @param card1 - primeira carta virada
 * @param card2 - segunda carta virada
 * @returns true se os valores forem iguais
 */
export function isMatch(card1: Card, card2: Card): boolean {
  return card1.value === card2.value;
}

/**
 * Indica se o jogo terminou (todos os pares encontrados).
 *
 * @param matchedPairs - pares encontrados
 * @param totalPairs - total de pares
 * @returns true quando matchedPairs === totalPairs
 */
export function isGameComplete(matchedPairs: number, totalPairs: number): boolean {
  return matchedPairs === totalPairs;
}

/**
 * Calcula o tempo decorrido em segundos a partir do timestamp de início.
 * Defesa contra relógio do sistema: nunca retorna valor negativo.
 *
 * @param startTime - Date.now() capturado no início da partida
 * @param endTime - timestamp de referência (padrão: agora)
 * @returns segundos inteiros decorridos (>= 0)
 */
export function getElapsedSeconds(startTime: number, endTime: number = Date.now()): number {
  return Math.max(0, Math.floor((endTime - startTime) / 1000));
}

/**
 * Tempo total de uma partida já finalizada (extraído do estado).
 *
 * @param state - estado do jogo
 * @returns segundos decorridos desde o início até o momento da chamada
 */
export function getGameElapsed(state: GameState): number {
  return getElapsedSeconds(state.startTime);
}
