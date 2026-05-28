import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDebounce } from '../hooks/useDebounce';
import images from '../assets/images';

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
  const [localValue, setLocalValue] = useState<string>(value);
  const debouncedValue = useDebounce<string>(localValue, debounceMs);

  // Keep local state in sync when parent resets the value externally
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    onChangeDebounced(debouncedValue);
  }, [debouncedValue]);

  const handleClear = () => {
    setLocalValue('');
    onChangeDebounced('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={localValue}
        onChangeText={setLocalValue}
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
            <Image source={images.icClose} style={styles.clearImage} resizeMode="contain" />
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
  clearImage: {
    width: 12,
    height: 12,
    tintColor: '#fff',
  },
});
