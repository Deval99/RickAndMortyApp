import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../assets/images';
import { CharacterAvatar } from '../../components/CharacterAvatar';
import { AvatarGridSkeleton } from '../../components/SkeletonLoader';
import { useEpisodeWithCharacters } from '../../hooks/useEpisodeWithCharacters';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import type { Character } from '../../types/character';
import { navigateToDetail } from '../../utils/navigateToDetail';

type Props = NativeStackScreenProps<RootStackParamList, 'EpisodeDetail'>;

export function EpisodeDetailScreen({ route, navigation }: Props) {
  const { episodeId } = route.params;
  const { episode, characters, isLoading, isError, error, refetch } =
    useEpisodeWithCharacters(episodeId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="" onBack={() => navigation.goBack()} />
        {/* Episode meta skeleton */}
        <View style={[styles.metaCard, { gap: 10 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 60, height: 36, borderRadius: 8, backgroundColor: '#e0e0e0' }} />
            <View style={{ flex: 1, gap: 6 }}>
              <View style={{ width: '70%', height: 16, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
              <View style={{ width: '40%', height: 13, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
            </View>
          </View>
          <View style={{ width: '50%', height: 13, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
        </View>
        <AvatarGridSkeleton count={9} />
      </SafeAreaView>
    );
  }

  if (isError || !episode) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {(error as { message?: string })?.message ?? 'Failed to load episode'}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            accessibilityRole="button"
          >
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem: ListRenderItem<Character> = ({ item }) => (
    <CharacterAvatar
      character={item}
      onPress={() => navigateToDetail(navigation, 'CharacterDetail', { characterId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={episode.name} onBack={() => navigation.goBack()} />

      {/* Episode meta */}
      <View style={styles.metaCard}>
        <View style={styles.metaRow}>
          <View style={styles.episodeBadge}>
            <Text style={styles.episodeCode}>{episode.episode}</Text>
          </View>
          <View style={styles.metaInfo}>
            <Text style={styles.metaName}>{episode.name}</Text>
            <Text style={styles.metaDate}>{episode.air_date}</Text>
          </View>
        </View>
        <Text style={styles.castLabel}>
          {characters.length} character{characters.length !== 1 ? 's' : ''} in this episode
        </Text>
      </View>

      {/* Character grid */}
      <FlatList
        data={characters}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface HeaderProps {
  title: string;
  onBack: () => void;
}

function Header({ title, onBack }: HeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Image source={images.icLeftArrow} style={styles.backIcon} resizeMode="contain" />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.backBtn} />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const ACCENT = '#00b5cc';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f7f8fa',
  },
  backBtn: {
    width: 36,
    alignItems: 'flex-start',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#1a1a2e',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
    marginHorizontal: 8,
  },

  // Meta card
  metaCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  episodeBadge: {
    backgroundColor: ACCENT + '18',
    borderWidth: 1.5,
    borderColor: ACCENT,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  episodeCode: {
    fontSize: 13,
    fontWeight: '700',
    color: ACCENT,
  },
  metaInfo: {
    flex: 1,
    gap: 2,
  },
  metaName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  metaDate: {
    fontSize: 13,
    color: '#888',
  },
  castLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },

  // Grid
  gridContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 8,
    marginBottom: 8,
  },

  // Error / retry
  errorText: {
    fontSize: 15,
    color: '#D63D2E',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryText: {
    fontSize: 14,
    color: ACCENT,
    fontWeight: '600',
  },
});
