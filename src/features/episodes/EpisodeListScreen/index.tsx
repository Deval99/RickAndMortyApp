import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  SectionList,
  SectionListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OfflineBanner } from '../../../components/OfflineBanner';
import { EpisodeListSkeleton } from '../../../components/SkeletonLoader';
import { useAllEpisodes, type EpisodeSeason } from '../../../hooks/useAllEpisodes';
import { useCollapsibleControls } from '../../../hooks/useCollapsibleControls';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import type { TabParamList } from '../../../navigation/AppNavigator';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import type { Episode } from '../../../types/episode';
import { EpisodeRow, ScreenHeader } from './EpisodeListComponents';
import styles from './styles';

type TabProps = BottomTabScreenProps<TabParamList, 'EpisodesPaginated'>;
type StackNav = NativeStackScreenProps<RootStackParamList>['navigation'];
type Props = TabProps & { navigation: TabProps['navigation'] & StackNav };

/**
 * Episode list screen (Episodes tab).
 *
 * Fetches all episodes across every page and groups them by season into a
 * sticky-header `SectionList`. A loading banner is shown at the top while
 * additional pages are still being fetched in the background.
 *
 * Handles initial loading, error, and success states.
 *
 * @param props - Navigation props injected by the bottom tab + root stack navigators.
 */
export function EpisodeListScreen({ navigation }: Props) {
  const { top } = useSafeAreaInsets();
  const { isOnline } = useNetworkStatus();
  const {
    controlsAnimatedStyle,
    controlsHeight,
    controlsPointerEvents,
    handleControlsLayout,
    handleScroll,
  } = useCollapsibleControls();
  const { seasons, isLoading, isError, error, refetch, isLoadingAll, totalLoaded } =
    useAllEpisodes();

  const renderItem: SectionListRenderItem<Episode, EpisodeSeason> = useCallback(
    ({ item }) => (
      <EpisodeRow
        episode={item}
        onPress={() =>
          navigation.navigate('EpisodeDetail', { episodeId: item.id })
        }
      />
    ),
    [navigation],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: EpisodeSeason }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionCount}>{section.data.length} episodes</Text>
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: Episode) => String(item.id), []);

  if (isLoading) {
    return (
      <View style={[styles.safeArea, { paddingTop: top }]}>
        <ScreenHeader />
        <EpisodeListSkeleton count={8} />
      </View>
    );
  }

  if (!isOnline && seasons.length === 0) {
    return (
      <View style={[styles.safeArea, { paddingTop: top }]}>
        <OfflineBanner visible />
        <ScreenHeader />
        <View style={styles.centered}>
          <Text style={styles.emptyText}>You're offline</Text>
          <Text style={styles.emptyText}>Connect to the internet to browse episodes.</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.safeArea, { paddingTop: top }]}>
        <ScreenHeader />
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {(error as { message?: string })?.message ?? 'Failed to load episodes'}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            accessibilityRole="button"
            style={styles.retryBtn}
          >
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.safeArea, { paddingTop: top }]}>
      <OfflineBanner visible={!isOnline} />
      <View style={styles.content}>
        <Animated.View
          onLayout={handleControlsLayout}
          pointerEvents={controlsPointerEvents}
          style={[styles.controls, controlsAnimatedStyle]}
        >
          <ScreenHeader />

          {/* Loading banner while fetching remaining pages */}
          {isLoadingAll && seasons.length > 0 && (
            <View style={styles.loadingBanner}>
              <Text style={styles.loadingBannerText}>
                Loading… {totalLoaded} episodes so far
              </Text>
            </View>
          )}

        </Animated.View>

        <SectionList
          sections={seasons}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={[styles.listContent, { paddingTop: controlsHeight }]}
        />
      </View>
    </View>
  );
}
