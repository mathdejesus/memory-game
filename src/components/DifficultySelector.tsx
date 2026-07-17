import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Difficulty } from '../types/game.types';
import { useTheme } from '../contexts/ThemeContext';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
}

const difficulties: { key: Difficulty; label: string; description: string }[] = [
  { key: 'easy', label: 'Fácil', description: '3×4 · 6 pares' },
  { key: 'medium', label: 'Médio', description: '4×4 · 8 pares' },
  { key: 'hard', label: 'Difícil', description: '4×5 · 10 pares' },
];

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.primary }]}>Memory Game</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Selecione a dificuldade</Text>
      {difficulties.map(({ key, label, description }) => (
        <TouchableOpacity
          key={key}
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => onSelect(key)}
          activeOpacity={0.7}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Dificuldade ${label}, ${description}`}
        >
          <Text style={styles.buttonLabel}>{label}</Text>
          <Text style={[styles.buttonDesc, { color: theme.headerTint }]}>{description}</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  button: {
    width: '80%',
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
    marginTop: 4,
  },
});
