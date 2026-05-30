import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import images from '../../../assets/images';
import { usePressAnimation } from '../../../hooks/usePressAnimation';
import type { FullLocation } from '../../../types/location';
import { styles } from './styles';

interface LocationCardProps {
  /** The location data to display. */
  location: FullLocation;
  /** Called when the card is tapped. */
  onPress: () => void;
}

/**
 * Tappable card that summarises a single location.
 *
 * Shows a location icon, the location name, type, dimension, and a residents
 * count badge. Includes a subtle scale press animation via
 * {@link usePressAnimation}.
 */
export function LocationCard({ location, onPress }: LocationCardProps) {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation({
    scaleValue: 1.02,
    shadowOpacityActive: 0.18,
    shadowOpacityInactive: 0.08,
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${location.name}, ${location.type}, ${location.dimension}`}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.cardTop}>
          <View style={styles.iconCircle}>
            <Image source={images.icLocation} style={styles.iconImage} resizeMode="contain" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName} numberOfLines={1}>
              {location.name}
            </Text>
            <Text style={styles.cardType} numberOfLines={1}>
              {location.type || 'Unknown type'}
            </Text>
            <Text style={styles.cardDimension} numberOfLines={1}>
              {location.dimension || 'Unknown dimension'}
            </Text>
          </View>
        </View>

        <View style={styles.cardBottom}>
          <View style={styles.residentsBadge}>
            <Text style={styles.residentsText}>
              {location.residents.length} resident{location.residents.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Image source={images.icLeftArrow} style={styles.chevron} resizeMode="contain" />
        </View>
      </Animated.View>
    </Pressable>
  );
}
