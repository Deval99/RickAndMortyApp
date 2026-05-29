import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import images from '../../../assets/images';
import { LocationCardSkeleton, LocationListSkeleton } from '../../../components/SkeletonLoader';
import { useCollapsibleControls } from '../../../hooks/useCollapsibleControls';
import { useInfiniteLocations } from '../../../hooks/useInfiniteLocations';
import { usePressAnimation } from '../../../hooks/usePressAnimation';
import type { RootStackParamList, TabParamList } from '../../../navigation/AppNavigator';
import type { FullLocation } from '../../../types/location';
import { styles } from './styles';

type TabProps = BottomTabScreenProps<TabParamList, 'LocationList'>;
type StackNav = NativeStackScreenProps<RootStackParamList>['navigation'];
type Props = TabProps & { navigation: TabProps['navigation'] & StackNav };


export function LocationListScreen({ navigation }: Props) {
  const { top } = useSafeAreaInsets();
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
    <View style={[styles.safeArea, { paddingTop: top }]}>
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

// ─── LocationCard ─────────────────────────────────────────────────────────────

interface LocationCardProps {
  location: FullLocation;
  onPress: () => void;
}

function LocationCard({ location, onPress }: LocationCardProps) {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation({
    scaleValue: 1.02,
    shadowOpacityActive: 0.18,
    shadowOpacityInactive: 0.08,
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${location.name}, ${location.type}, ${location.dimension}`}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.cardTop}>
          <View style={styles.iconCircle}>
            <Image source={images.icLocation} style={styles.iconImage} resizeMode="contain" />
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
              {location.residents.length} resident{location.residents.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Image source={images.icLeftArrow} style={styles.chevron} resizeMode="contain" />
        </View>
      </Animated.View>
    </Pressable>
  );
}
