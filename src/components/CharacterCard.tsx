import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { StatusBadge } from './StatusBadge';
import type { Character } from '../types/character';

interface Props {
  character: Character;
  navigation?: NativeStackNavigationProp<RootStackParamList, 'CharacterList'>;
}

export function CharacterCard({ character, navigation }: Props) {
  const handlePress = () => {
    navigation?.navigate('CharacterDetail', { characterId: character.id });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${character.name}, ${character.status}`}
    >
      <Image
        source={{ uri: character.image }}
        style={styles.avatar}
        resizeMode="cover"
        accessibilityLabel={`${character.name} avatar`}
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
    </TouchableOpacity>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 100,
    height: 100,
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
