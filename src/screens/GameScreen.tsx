import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GameBoard } from '../components/GameBoard';
import { ScoreBoard } from '../components/ScoreBoard';
import { GameOverModal } from '../components/GameOverModal';
import { useGameLogic } from '../hooks/useGameLogic';
import { useGameState } from '../hooks/useGameState';
import { Difficulty } from '../types/game.types';
import { GameStats } from '../types/game.types';
import { StorageManager } from '../utils/storageManager';
import { getElapsedSeconds } from '../utils/gameEngine';
import { useTheme } from '../contexts/ThemeContext';

interface GameScreenProps {
  route: { params: { difficulty: Difficulty } };
  navigation: any;
}

export default function GameScreen({ route, navigation }: GameScreenProps) {
  const { theme } = useTheme();
  const { difficulty } = route.params;
  const { gameState, handleCardPress, resetGame } = useGameLogic(difficulty);
  const { saveGame } = useGameState();

  const [gameOverVisible, setGameOverVisible] = useState(false);
  // Tempo congelado no instante do game over (evita漂移 de relógio no render).
  const [finalElapsed, setFinalElapsed] = useState(0);

  useEffect(() => {
    if (gameState.isGameOver) {
      const elapsed = getElapsedSeconds(gameState.startTime);
      setFinalElapsed(elapsed);
      setGameOverVisible(true);
      saveGame(gameState);

      const won = gameState.matchedPairs === gameState.cards.length / 2;
      StorageManager.getStats().then((existing) => {
        const currentStats: GameStats = {
          gamesPlayed: (existing?.gamesPlayed ?? 0) + 1,
          gamesWon: (existing?.gamesWon ?? 0) + (won ? 1 : 0),
          bestTime: existing?.bestTime ? Math.min(existing.bestTime, elapsed) : elapsed,
          totalScore: (existing?.totalScore ?? 0) + gameState.score,
          lastPlayDate: new Date().toISOString(),
        };
        StorageManager.saveStats(currentStats);
      });
    }
  }, [gameState.isGameOver]);

  const handlePlayAgain = useCallback(() => {
    setGameOverVisible(false);
    setFinalElapsed(0);
    resetGame();
  }, [resetGame]);

  const handleMenu = useCallback(() => {
    setGameOverVisible(false);
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScoreBoard
        score={gameState.score}
        attempts={gameState.attempts}
        matchedPairs={gameState.matchedPairs}
        totalPairs={gameState.cards.length / 2}
        startTime={gameState.startTime}
      />
      <GameBoard
        cards={gameState.cards}
        onCardPress={handleCardPress}
        disabled={gameState.isGameOver}
      />
      <GameOverModal
        visible={gameOverVisible}
        score={gameState.score}
        attempts={gameState.attempts}
        won={gameState.matchedPairs === gameState.cards.length / 2}
        elapsedTime={finalElapsed}
        onPlayAgain={handlePlayAgain}
        onMenu={handleMenu}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'scroll',
  },
});
