import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Character } from '../types/character';

/**
 * Props for the {@link StatusBadge} component.
 */
interface Props {
  /** The character's alive/dead/unknown status. */
  status: Character['status'];
}

/**
 * Colour map from status value to its brand colour.
 */
const STATUS_COLORS: Record<Character['status'], string> = {
  Alive: '#55CC44',
  Dead: '#D63D2E',
  unknown: '#9E9E9E',
};

/**
 * Pill-shaped badge that shows a character's life status with a coloured dot
 * and label.
 *
 * The background and border are tinted with a 13 % opacity version of the
 * status colour so the badge remains legible on any background.
 *
 * @param props - {@link Props}
 */
export function StatusBadge({ status }: Props) {
  const color = STATUS_COLORS[status];
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
