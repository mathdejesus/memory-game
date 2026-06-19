import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Card as CardType } from '../types/game.types';

interface CardProps {
  card: CardType;
  onPress: () => void;
  disabled: boolean;
}

function CardComponent({ card, onPress, disabled }: CardProps) {
  const flipProgress = useSharedValue(card.isFlipped || card.isMatched ? 1 : 0);

  React.useEffect(() => {
    flipProgress.value = withTiming(card.isFlipped || card.isMatched ? 1 : 0, { duration: 300 });
  }, [card.isFlipped, card.isMatched]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [180, 360]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
    };
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled || card.isMatched}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <Text style={styles.emoji}>{card.value}</Text>
      </Animated.View>
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <Text style={styles.questionMark}>?</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '23%',
    aspectRatio: 1,
    margin: '1%',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: '#4A90D9',
    borderWidth: 2,
    borderColor: '#357ABD',
  },
  cardBack: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#DDD',
  },
  questionMark: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
  },
  emoji: {
    fontSize: 32,
  },
});

export const Card = memo(CardComponent);
