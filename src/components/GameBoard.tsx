import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card as CardType } from '../types/game.types';
import { Card } from './Card';

interface GameBoardProps {
  cards: CardType[];
  onCardPress: (cardId: string) => void;
  disabled: boolean;
}

export function GameBoard({ cards, onCardPress, disabled }: GameBoardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onPress={() => onCardPress(card.id)}
            disabled={disabled}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
