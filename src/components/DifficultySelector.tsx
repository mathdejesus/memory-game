import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Difficulty } from '../types/game.types';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
}

const difficulties: { key: Difficulty; label: string; description: string }[] = [
  { key: 'easy', label: 'Fácil', description: '3×4 · 6 pares' },
  { key: 'medium', label: 'Médio', description: '4×4 · 8 pares' },
  { key: 'hard', label: 'Difícil', description: '4×5 · 10 pares' },
];

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Game</Text>
      <Text style={styles.subtitle}>Selecione a dificuldade</Text>
      {difficulties.map(({ key, label, description }) => (
        <TouchableOpacity
          key={key}
          style={styles.button}
          onPress={() => onSelect(key)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonLabel}>{label}</Text>
          <Text style={styles.buttonDesc}>{description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A90D9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  button: {
    width: '80%',
    backgroundColor: '#4A90D9',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  buttonDesc: {
    fontSize: 14,
    color: '#D6E8F7',
    marginTop: 4,
  },
});
