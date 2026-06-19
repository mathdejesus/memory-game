import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

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
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{won ? 'Parabéns!' : 'Fim de Jogo'}</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>
              Score: <Text style={styles.statValue}>{score}</Text>
            </Text>
            <Text style={styles.stat}>
              Tentativas: <Text style={styles.statValue}>{attempts}</Text>
            </Text>
            <Text style={styles.stat}>
              Tempo: <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
            <Text style={styles.buttonText}>Jogar Novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onMenu}>
            <Text style={styles.secondaryButtonText}>Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 32,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  stats: {
    width: '100%',
    marginBottom: 24,
  },
  stat: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    width: '100%',
    backgroundColor: '#4A90D9',
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
    color: '#4A90D9',
  },
});
