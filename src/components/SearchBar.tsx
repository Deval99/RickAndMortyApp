import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  value: string;
  onChangeDebounced: (text: string) => void;
  debounceMs?: number;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeDebounced,
  debounceMs = 300,
  placeholder = 'Search characters…',
}: Props) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local state in sync when parent resets the value externally
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (text: string) => {
    setLocalValue(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChangeDebounced(text);
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalValue('');
    if (timerRef.current) clearTimeout(timerRef.current);
    onChangeDebounced('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={localValue}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        returnKeyType="search"
        accessibilityLabel="Search characters"
        accessibilityRole="search"
      />
      {localValue.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.clearBtn}
          accessibilityLabel="Clear search"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={styles.clearIcon}>
            <Text style={styles.clearText}>×</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 42,
    fontSize: 15,
    color: '#1a1a2e',
  },
  clearBtn: {
    padding: 4,
  },
  clearIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
});
