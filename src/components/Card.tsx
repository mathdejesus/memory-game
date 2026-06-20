import React, { memo } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Card as CardType } from '../types/game.types';
import { useTheme } from '../contexts/ThemeContext';

interface CardProps {
  card: CardType;
  onPress: () => void;
  disabled: boolean;
}

function CardComponent({ card, onPress, disabled }: CardProps) {
  const { theme } = useTheme();
  const isRevealed = card.isFlipped || card.isMatched;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled || card.isMatched}
      activeOpacity={0.8}
    >
      {isRevealed ? (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={styles.emoji}>{card.value}</Text>
        </View>
      ) : (
        <View style={[styles.card, styles.cardFront]}>
          <Text style={styles.questionMark}>?</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    margin: 6,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  cardFront: {
    backgroundColor: '#4A90D9',
    borderColor: '#357ABD',
  },
  questionMark: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
  },
  emoji: {
    fontSize: 40,
  },
});

export const Card = memo(CardComponent);
