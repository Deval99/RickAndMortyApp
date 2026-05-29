import React, { useCallback, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePressAnimation } from '../hooks/usePressAnimation';
import type { Character } from '../types/character';

// Grid constants — must match the FlatList's contentContainerStyle padding and columnWrapperStyle gap
const NUM_COLUMNS = 3;
const GRID_HORIZONTAL_PADDING = 12; // paddingHorizontal on contentContainerStyle (each side)
const COLUMN_GAP = 8; // gap in columnWrapperStyle
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH =
  (SCREEN_WIDTH - GRID_HORIZONTAL_PADDING * 2 - COLUMN_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

interface CharacterAvatarProps {
  character: Character;
  onPress: () => void;
}

export function CharacterAvatar({ character, onPress }: CharacterAvatarProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation({
    scaleValue: 1.05,
    shadowOpacityActive: 0.15,
    shadowOpacityInactive: 0.06,
  });

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setErrored(true), []);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${character.name}, ${character.status}`}
      style={styles.container}
    >
      <Animated.View style={[styles.avatarCard, animatedStyle]}>
        <View style={styles.avatarImageWrapper}>
          {!loaded && !errored && <View style={styles.avatarPlaceholder} />}
          {errored ? (
            <View style={[styles.avatarPlaceholder, styles.avatarError]}>
              <Text style={styles.avatarErrorIcon}>?</Text>
            </View>
          ) : (
            <Image
              source={{ uri: character.image }}
              style={[styles.avatarImage, !loaded && styles.avatarImageHidden]}
              resizeMode="cover"
              onLoad={handleLoad}
              onError={handleError}
              accessibilityLabel={`${character.name} avatar`}
            />
          )}
        </View>
        <Text style={styles.avatarName} numberOfLines={2}>
          {character.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// Total gaps per row = (NUM_COLUMNS - 1) * COLUMN_GAP
// Total side padding = GRID_HORIZONTAL_PADDING * 2
// Item width = (screenWidth - totalPadding - totalGaps) / NUM_COLUMNS

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
  },
  avatarCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    gap: 6,
  },
  avatarImageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e8e8e8',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarImageHidden: {
    opacity: 0,
  },
  avatarPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8e8e8',
  },
  avatarError: {
    backgroundColor: '#f5e6e6',
  },
  avatarErrorIcon: {
    fontSize: 20,
    color: '#D63D2E',
    fontWeight: '700',
  },
  avatarName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1a1a2e',
    textAlign: 'center',
    lineHeight: 14,
  },
});
