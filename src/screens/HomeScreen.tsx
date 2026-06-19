import React from 'react';
import { View, StyleSheet } from 'react-native';
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
