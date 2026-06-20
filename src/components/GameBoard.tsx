import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card as CardType } from '../types/game.types';
import { Card } from './Card';

interface GameBoardProps {
  cards: CardType[];
  onCardPress: (cardId: string) => void;
  disabled: boolean;
}

export function GameBoard({ cards, onCardPress, disabled }: GameBoardProps) {
  return (
    <View style={styles.wrapper}>
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
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    overflow: 'scroll',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 400,
  },
});
