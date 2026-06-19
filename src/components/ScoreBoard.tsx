import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreBoardProps {
  score: number;
  attempts: number;
  matchedPairs: number;
  totalPairs: number;
  startTime: number;
}

export function ScoreBoard({ score, attempts, matchedPairs, totalPairs, startTime }: ScoreBoardProps) {
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
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>Score</Text>
        <Text style={styles.value}>{score}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Tentativas</Text>
        <Text style={styles.value}>{attempts}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Pares</Text>
        <Text style={styles.value}>{matchedPairs}/{totalPairs}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Tempo</Text>
        <Text style={styles.value}>{formatTime(elapsed)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
