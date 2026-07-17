import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { useTheme } from '../contexts/ThemeContext';

export default function StatsScreen() {
  const { theme } = useTheme();
  const { stats, loading, error, loadStats, clearData } = useAsyncStorage();

  useEffect(() => {
    loadStats();
  }, []);

  const handleClear = () => {
    Alert.alert(
      'Limpar dados',
      'Isso vai apagar todas as suas estatísticas e partidas salvas. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearData();
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível limpar os dados.');
            }
          },
        },
      ]
    );
  };

  if (loading || !stats) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.loading, { color: theme.textSecondary }]}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.loading, { color: theme.textSecondary }]}>
          Não foi possível carregar as estatísticas.
        </Text>
        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: theme.primary }]}
          onPress={loadStats}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
        >
          <Text style={styles.clearButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (date: string) => {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Estatísticas</Text>
        <View
          style={[styles.card, { backgroundColor: theme.surface }]}
          accessible
          accessibilityRole="summary"
          accessibilityLabel="Resumo das estatísticas do jogador"
        >
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Partidas Jogadas</Text>
            <Text style={[styles.value, { color: theme.text }]}>{stats.gamesPlayed}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Partidas Vencidas</Text>
            <Text style={[styles.value, { color: theme.text }]}>{stats.gamesWon}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Melhor Tempo</Text>
            <Text style={[styles.value, { color: theme.text }]}>{stats.bestTime}s</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Score Total</Text>
            <Text style={[styles.value, { color: theme.text }]}>{stats.totalScore}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Última Partida</Text>
            <Text style={[styles.value, { color: theme.text }]}>{formatDate(stats.lastPlayDate)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: theme.primary }]}
          onPress={handleClear}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Limpar todos os dados"
        >
          <Text style={styles.clearButtonText}>Limpar Dados</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
  },
  clearButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
