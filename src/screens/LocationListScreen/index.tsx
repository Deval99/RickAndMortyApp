import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInfiniteLocations } from '../../hooks/useInfiniteLocations';
import type { RootStackParamList, TabParamList } from '../../navigation/AppNavigator';
import type { RMLocation } from '../../types/location';
import { ACCENT, styles } from './styles';

type TabProps = BottomTabScreenProps<TabParamList, 'LocationList'>;
type StackNav = NativeStackScreenProps<RootStackParamList>['navigation'];
type Props = TabProps & { navigation: TabProps['navigation'] & StackNav };

/** Pick a representative emoji for a location type */
function locationIcon(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('planet')) return '🪐';
  if (t.includes('space')) return '🚀';
  if (t.includes('microverse') || t.includes('micro')) return '🔬';
  if (t.includes('dream')) return '💭';
  if (t.includes('resort')) return '🏖️';
  if (t.includes('fantasy')) return '🧙';
  if (t.includes('dimension')) return '🌀';
  if (t.includes('cluster')) return '✨';
  if (t.includes('game')) return '🎮';
  if (t.includes('tv')) return '📺';
  if (t.includes('unknown')) return '❓';
  return '🌍';
}

export function LocationListScreen({ navigation }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteLocations();

  const locations = useMemo(
    () => data?.pages.flatMap(page => page.results) ?? [],
    [data],
  );

  const totalCount = data?.pages[0]?.info.count ?? 0;

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem: ListRenderItem<RMLocation> = useCallback(
    ({ item }) => (
      <LocationCard
        location={item}
        onPress={() => navigation.navigate('LocationDetail', { locationId: item.id })}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: RMLocation) => String(item.id), []);

  const ListFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={ACCENT} />
      </View>
    );
  }, [isFetchingNextPage]);

  const ListEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={ACCENT} />
        </View>
      );
    }
    if (isError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {(error as { message?: string })?.message ?? 'Something went wrong'}
          </Text>
          <Text style={styles.retryText} onPress={() => refetch()}>
            Tap to retry
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No locations found</Text>
      </View>
    );
  }, [isLoading, isError, error, refetch]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Locations</Text>
        {totalCount > 0 && (
          <Text style={styles.subtitle}>{totalCount} locations across the multiverse</Text>
        )}
      </View>

      <FlatList
        data={locations}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.15}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={
          locations.length === 0 ? styles.emptyContainer : styles.listContent
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ─── LocationCard ─────────────────────────────────────────────────────────────

interface LocationCardProps {
  location: RMLocation;
  onPress: () => void;
}

function LocationCard({ location, onPress }: LocationCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${location.name}, ${location.type}, ${location.dimension}`}
    >
      <View style={styles.cardTop}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>{locationIcon(location.type)}</Text>
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
            👥 {location.residents.length} resident{location.residents.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}
