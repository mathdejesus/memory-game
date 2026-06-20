import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ScoreBoardProps {
  score: number;
  attempts: number;
  matchedPairs: number;
  totalPairs: number;
  startTime: number;
}

export function ScoreBoard({ score, attempts, matchedPairs, totalPairs, startTime }: ScoreBoardProps) {
  const { theme } = useTheme();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.scoreboardBg }]}>
      <View style={styles.item}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Score</Text>
        <Text style={[styles.value, { color: theme.text }]}>{score}</Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Tentativas</Text>
        <Text style={[styles.value, { color: theme.text }]}>{attempts}</Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Pares</Text>
        <Text style={[styles.value, { color: theme.text }]}>{matchedPairs}/{totalPairs}</Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Tempo</Text>
        <Text style={[styles.value, { color: theme.text }]}>{formatTime(elapsed)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
