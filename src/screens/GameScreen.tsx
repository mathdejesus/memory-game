import React, { useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { GameBoard } from '../components/GameBoard';
import { ScoreBoard } from '../components/ScoreBoard';
import { GameOverModal } from '../components/GameOverModal';
import { useGameLogic } from '../hooks/useGameLogic';
import { useGameState } from '../hooks/useGameState';
import { Difficulty } from '../types/game.types';

interface GameScreenProps {
  route: { params: { difficulty: Difficulty } };
  navigation: any;
}

export default function GameScreen({ route, navigation }: GameScreenProps) {
  const { difficulty } = route.params;
  const { gameState, handleCardPress, resetGame } = useGameLogic(difficulty);
  const { saveGame } = useGameState();

  const [gameOverVisible, setGameOverVisible] = useState(false);

  React.useEffect(() => {
    if (gameState.isGameOver) {
      const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
      setGameOverVisible(true);
      saveGame(gameState);
    }
  }, [gameState.isGameOver]);

  const handlePlayAgain = useCallback(() => {
    setGameOverVisible(false);
    resetGame();
  }, [resetGame]);

  const handleMenu = useCallback(() => {
    setGameOverVisible(false);
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
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
        elapsedTime={Math.floor((Date.now() - gameState.startTime) / 1000)}
        onPlayAgain={handlePlayAgain}
        onMenu={handleMenu}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
