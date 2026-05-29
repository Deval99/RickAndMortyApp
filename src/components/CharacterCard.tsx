import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  SharedTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { RootStackParamList } from '../navigation/AppNavigator';
import { StatusBadge } from './StatusBadge';
import type { Character } from '../types/character';

interface Props {
  character: Character;
  navigation?: NativeStackNavigationProp<RootStackParamList>;
}

const avatarTransition = SharedTransition.createInstance()
  .springify()
  .damping(20)
  .stiffness(200);

export function CharacterCard({ character, navigation }: Props) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
    elevation: shadowOpacity.value > 0.1 ? 6 : 2,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(1.025, { damping: 15, stiffness: 100 });
    shadowOpacity.value = withTiming(0.22, { duration: 120 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    shadowOpacity.value = withTiming(0.1, { duration: 200 });
  };

  const handlePress = () => {
    navigation?.navigate('CharacterDetail', { characterId: character.id });
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${character.name}, ${character.status}`}
    >
      <Animated.View style={[styles.card, animatedCardStyle]}>
        <Animated.Image
          source={{ uri: character.image }}
          style={styles.avatar}
          resizeMode="cover"
          accessibilityLabel={`${character.name} avatar`}
          sharedTransitionTag={`character-avatar-${character.id}`}
          sharedTransitionStyle={avatarTransition}
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {character.name}
          </Text>
          <StatusBadge status={character.status} />
          <Text style={styles.meta} numberOfLines={1}>
            {character.species}
          </Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationLabel}>Last seen: </Text>
            <Text style={styles.locationValue} numberOfLines={1}>
              {character.location.name}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
    // Base shadow — opacity is driven by Reanimated
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 110,
    height: '100%',
  },
  info: {
    flex: 1,
    padding: 10,
    gap: 4,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  meta: {
    fontSize: 13,
    color: '#555',
  },
  locationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationLabel: {
    fontSize: 12,
    color: '#888',
  },
  locationValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    flexShrink: 1,
  },
});
