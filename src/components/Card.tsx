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

  // Estado acessível por leitores de tela.
  const accessibilityLabel = card.isMatched
    ? `Carta par encontrado, ${card.value}`
    : isRevealed
    ? `Carta revelada, ${card.value}`
    : 'Carta virada para baixo';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled || card.isMatched}
      activeOpacity={0.8}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: disabled || card.isMatched, selected: isRevealed }}
    >
      {isRevealed ? (
        <View
          style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.primary }]}
        >
          <Text style={[styles.emoji, { color: theme.text }]}>{card.value}</Text>
        </View>
      ) : (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.primary, borderColor: theme.primaryDark },
          ]}
        >
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
