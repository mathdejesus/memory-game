import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DifficultySelector } from '../components/DifficultySelector';
import { Difficulty } from '../types/game.types';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const handleSelectDifficulty = (difficulty: Difficulty) => {
    navigation.navigate('Game', { difficulty });
  };

  return (
    <View style={styles.container}>
      <DifficultySelector onSelect={handleSelectDifficulty} />
      <TouchableOpacity
        style={styles.statsButton}
        onPress={() => navigation.navigate('Stats')}
        activeOpacity={0.7}
      >
        <Text style={styles.statsButtonText}>Estatísticas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  statsButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#6C757D',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  statsButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
