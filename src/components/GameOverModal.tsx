import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface GameOverModalProps {
  visible: boolean;
  score: number;
  attempts: number;
  won: boolean;
  elapsedTime: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export function GameOverModal({
  visible,
  score,
  attempts,
  won,
  elapsedTime,
  onPlayAgain,
  onMenu,
}: GameOverModalProps) {
  const { theme } = useTheme();

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.modal, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>{won ? 'Parabéns!' : 'Fim de Jogo'}</Text>
          <View style={styles.stats}>
            <Text style={[styles.stat, { color: theme.textSecondary }]}>
              Score: <Text style={[styles.statValue, { color: theme.text }]}>{score}</Text>
            </Text>
            <Text style={[styles.stat, { color: theme.textSecondary }]}>
              Tentativas: <Text style={[styles.statValue, { color: theme.text }]}>{attempts}</Text>
            </Text>
            <Text style={[styles.stat, { color: theme.textSecondary }]}>
              Tempo: <Text style={[styles.statValue, { color: theme.text }]}>{formatTime(elapsedTime)}</Text>
            </Text>
          </View>
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={onPlayAgain}>
            <Text style={styles.buttonText}>Jogar Novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onMenu}>
            <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderRadius: 20,
    padding: 32,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  stats: {
    width: '100%',
    marginBottom: 24,
  },
  stat: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  secondaryButton: {
    padding: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
  },
});
