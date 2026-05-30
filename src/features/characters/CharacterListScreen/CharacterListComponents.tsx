import React from 'react';
import { Text, View } from 'react-native';
import { CharacterCardSkeleton, CharacterListSkeleton } from '../../../components/SkeletonLoader';
import { styles } from './styles';

interface ListEmptyProps {
  isLoading: boolean;
  isOnline: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
}

/**
 * Renders the appropriate empty-state UI for the character list:
 * loading skeleton, offline message, error with retry, or "no results".
 */
export function CharacterListEmpty({ isLoading, isOnline, isError, error, onRetry }: ListEmptyProps) {
  if (isLoading) {
    return <CharacterListSkeleton count={6} />;
  }
  if (!isOnline) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>You're offline</Text>
        <Text style={styles.emptyText}>Connect to the internet to browse characters.</Text>
      </View>
    );
  }
  if (isError) {
    const is404 = (error as { statusCode?: number })?.statusCode === 404;
    if (is404) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No data found</Text>
        </View>
      );
    }
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {(error as { message?: string })?.message ?? 'Something went wrong'}
        </Text>
        <Text style={styles.retryText} onPress={onRetry}>
          Tap to retry
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.centered}>
      <Text style={styles.emptyText}>No characters found</Text>
    </View>
  );
}

interface ListFooterProps {
  hasNextPage: boolean;
}

/** Shows a skeleton card while the next page is loading. */
export function CharacterListFooter({ hasNextPage }: ListFooterProps) {
  if (!hasNextPage) return null;
  return <CharacterCardSkeleton />;
}
