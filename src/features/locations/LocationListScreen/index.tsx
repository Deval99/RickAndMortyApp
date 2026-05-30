import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  ListRenderItem,
  Text,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OfflineBanner } from '../../../components/OfflineBanner';
import { LocationCardSkeleton, LocationListSkeleton } from '../../../components/SkeletonLoader';
import { useCollapsibleControls } from '../../../hooks/useCollapsibleControls';
import { useInfiniteLocations } from '../../../hooks/useInfiniteLocations';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import type { RootStackParamList, TabParamList } from '../../../navigation/AppNavigator';
import type { FullLocation } from '../../../types/location';
import { LocationCard } from './LocationCard';
import { styles } from './styles';

type TabProps = BottomTabScreenProps<TabParamList, 'LocationList'>;
type StackNav = NativeStackScreenProps<RootStackParamList>['navigation'];
type Props = TabProps & { navigation: TabProps['navigation'] & StackNav };


/**
 * Location list screen (Locations tab).
 *
 * Infinite-scroll list of Rick and Morty universe locations. Each card shows
 * the location name, type, dimension, and resident count. Tapping a card
 * navigates to {@link LocationDetailScreen}.
 *
 * The header collapses on scroll via {@link useCollapsibleControls}.
 *
 * @param props - Navigation props injected by the bottom tab + root stack navigators.
 */
export function LocationListScreen({ navigation }: Props) {
  const { top } = useSafeAreaInsets();
  const { isOnline } = useNetworkStatus();
  const {
    controlsAnimatedStyle,
    controlsHeight,
    controlsPointerEvents,
    handleControlsLayout,
    handleScroll,
  } = useCollapsibleControls();
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

  const renderItem: ListRenderItem<FullLocation> = useCallback(
    ({ item }) => (
      <LocationCard
        location={item}
        onPress={() => navigation.navigate('LocationDetail', { locationId: item.id })}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: FullLocation) => String(item.id), []);

  const ListFooter = useCallback(() => {
    if (!hasNextPage) return null;
    return <LocationCardSkeleton containerStyle={{ marginHorizontal: 0 }} />;
  }, [hasNextPage]);

  const ListEmpty = useCallback(() => {
    if (isLoading) {
      return <LocationListSkeleton count={6} />;
    }
    if (!isOnline) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>You're offline</Text>
          <Text style={styles.emptyText}>Connect to the internet to browse locations.</Text>
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
  }, [isLoading, isOnline, isError, error, refetch]);

  return (
    <View style={[styles.safeArea, { paddingTop: top }]}>
      <OfflineBanner visible={!isOnline} />
      <View style={styles.content}>
        <Animated.View
          onLayout={handleControlsLayout}
          pointerEvents={controlsPointerEvents}
          style={[styles.controls, controlsAnimatedStyle]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Locations</Text>
            {totalCount > 0 && (
              <Text style={styles.subtitle}>{totalCount} locations across the multiverse</Text>
            )}
          </View>
        </Animated.View>

        <FlatList
          data={locations}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.15}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={[
            locations.length === 0 ? styles.emptyContainer : styles.listContent,
            { paddingTop: controlsHeight },
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
