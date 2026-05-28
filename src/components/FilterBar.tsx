import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Character } from '../types/character';

type Status = Character['status'] | '';
type Gender = Character['gender'] | '';

interface Props {
  selectedStatus: Status;
  selectedGender: Gender;
  onStatusChange: (status: Status) => void;
  onGenderChange: (gender: Gender) => void;
}

const STATUS_OPTIONS: { label: string; value: Status }[] = [
  { label: 'All', value: '' },
  { label: 'Alive', value: 'Alive' },
  { label: 'Dead', value: 'Dead' },
  { label: 'Unknown', value: 'unknown' },
];

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: 'All', value: '' },
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Genderless', value: 'Genderless' },
  { label: 'Unknown', value: 'unknown' },
];

const ACCENT = '#00b5cc';

export function FilterBar({
  selectedStatus,
  selectedGender,
  onStatusChange,
  onGenderChange,
}: Props) {
  return (
    <View style={styles.wrapper}>
      {/* Status row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        accessibilityLabel="Filter by status"
      >
        {STATUS_OPTIONS.map(opt => {
          const active = selectedStatus === opt.value;
          return (
            <TouchableOpacity
              key={`status-${opt.value}`}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onStatusChange(opt.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Status: ${opt.label}`}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Gender row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        accessibilityLabel="Filter by gender"
      >
        {GENDER_OPTIONS.map(opt => {
          const active = selectedGender === opt.value;
          return (
            <TouchableOpacity
              key={`gender-${opt.value}`}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onGenderChange(opt.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Gender: ${opt.label}`}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  chipActive: {
    borderColor: ACCENT,
    backgroundColor: ACCENT + '18',
  },
  chipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  chipTextActive: {
    color: ACCENT,
    fontWeight: '700',
  },
});
