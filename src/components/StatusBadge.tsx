import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Character } from '../types/character';

interface Props {
  status: Character['status'];
}

const STATUS_COLORS: Record<Character['status'], string> = {
  Alive: '#55CC44',
  Dead: '#D63D2E',
  unknown: '#9E9E9E',
};

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
