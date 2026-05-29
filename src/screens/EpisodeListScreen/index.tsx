import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  Animated,
  Image,
  SectionList,
  SectionListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import images from '../../assets/images';
import { EpisodeListSkeleton } from '../../components/SkeletonLoader';
import { useCollapsibleControls } from '../../hooks/useCollapsibleControls';
import type { TabParamList } from '../../navigation/AppNavigator';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import type { Episode } from '../../types/episode';
import { useAllEpisodes, type EpisodeSeason } from '../../hooks/useAllEpisodes';

type TabProps = BottomTabScreenProps<TabParamList, 'EpisodesPaginated'>;
type StackNav = NativeStackScreenProps<RootStackParamList>['navigation'];
type Props = TabProps & { navigation: TabProps['navigation'] & StackNav };

export function EpisodeListScreen({ navigation }: Props) {
  const { top } = useSafeAreaInsets();
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

// ─── Sub-components ──────────────────────────────────────────────────────────

function ScreenHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Episodes</Text>
    </View>
  );
}

interface EpisodeRowProps {
  episode: Episode;
  onPress: () => void;
}

function EpisodeRow({ episode, onPress }: EpisodeRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${episode.episode} – ${episode.name}`}
    >
      <View style={styles.episodeBadge}>
        <Text style={styles.episodeCode}>{episode.episode}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>
          {episode.name}
        </Text>
        <Text style={styles.rowMeta}>{episode.air_date}</Text>
      </View>
      <Image source={images.icLeftArrow} style={styles.rowChevron} resizeMode="contain" />
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const ACCENT = '#00b5cc';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  content: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#f7f8fa',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f7f8fa',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ACCENT + '18',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingBannerText: {
    fontSize: 13,
    color: ACCENT,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f7f8fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  episodeBadge: {
    backgroundColor: ACCENT + '18',
    borderWidth: 1.5,
    borderColor: ACCENT,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  episodeCode: {
    fontSize: 12,
    fontWeight: '700',
    color: ACCENT,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  rowMeta: {
    fontSize: 12,
    color: '#888',
  },
  rowChevron: {
    width: 18,
    height: 18,
    tintColor: '#ccc',
    transform: [{ rotate: '180deg' }],
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  errorText: {
    fontSize: 15,
    color: '#D63D2E',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryBtn: {
    marginTop: 4,
  },
  retryText: {
    fontSize: 14,
    color: ACCENT,
    fontWeight: '600',
  },
});
