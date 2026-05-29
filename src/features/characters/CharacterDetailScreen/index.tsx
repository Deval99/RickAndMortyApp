import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  SharedTransition,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../../assets/images';
import { StatusBadge } from '../../../components/StatusBadge';
import { AvatarGridSkeleton } from '../../../components/SkeletonLoader';
import { useCharacter } from '../../../hooks/useCharacter';
import { useFavourite } from '../../../hooks/useFavourite';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import { navigateToDetail } from '../../../utils/navigateToDetail';

type Props = NativeStackScreenProps<RootStackParamList, 'CharacterDetail'>;

const avatarTransition = SharedTransition.createInstance()
  .springify()
  .damping(20)
  .stiffness(200);

/**
 * Extracts the episode number from a Rick and Morty API episode URL and
 * returns a short label like `"EP 28"`.
 *
 * @param url - Full episode URL, e.g. `https://rickandmortyapi.com/api/episode/28`.
 * @returns Short label string, or the original URL if no match is found.
 */
function episodeLabel(url: string): string {
  const match = url.match(/\/episode\/(\d+)$/);
  return match ? `EP ${match[1]}` : url;
}

/**
 * Character detail screen.
 *
 * Displays a large avatar (with a shared-element spring transition from the
 * list), character metadata cards (info, origin, last known location), a
 * horizontal episode chip list, and a favourite toggle button in the header.
 *
 * Handles loading, error, and success states independently.
 *
 * @param props - Navigation props injected by the root stack navigator.
 */
export function CharacterDetailScreen({ route, navigation }: Props) {
  const { characterId } = route.params;
  const { data: character, isLoading, isError, error, refetch } = useCharacter(characterId);
  const { isFavourite, toggle } = useFavourite(characterId, character);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header onBack={() => navigation.goBack()} title="" isFavourite={false} onToggle={() => {}} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Avatar skeleton */}
          <View style={[styles.avatar, { backgroundColor: '#e0e0e0' }]} />
          {/* Name + status skeleton */}
          <View style={[styles.nameRow, { gap: 8 }]}>
            <View style={{ width: '60%', height: 26, borderRadius: 6, backgroundColor: '#e0e0e0' }} />
            <View style={{ width: 80, height: 22, borderRadius: 12, backgroundColor: '#e0e0e0' }} />
          </View>
          {/* Info card skeletons */}
          <AvatarGridSkeleton count={0} />
          {[1, 2, 3].map(i => (
            <View key={i} style={[styles.card, { gap: 10 }]}>
              <View style={{ width: '40%', height: 13, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
              {[1, 2, 3].map(j => (
                <View key={j} style={{ width: '100%', height: 14, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
              ))}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError || !character) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header onBack={() => navigation.goBack()} title="" isFavourite={false} onToggle={() => {}} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {(error as { message?: string })?.message ?? 'Failed to load character'}
          </Text>
          <TouchableOpacity onPress={() => refetch()} accessibilityRole="button">
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const createdDate = new Date(character.created).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        onBack={() => navigation.goBack()}
        title={character.name}
        isFavourite={isFavourite}
        onToggle={toggle}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Large Avatar ── */}
        <Animated.Image
          source={{ uri: character.image }}
          style={styles.avatar}
          resizeMode="cover"
          accessibilityLabel={`${character.name} avatar`}
          sharedTransitionTag={`character-avatar-${character.id}`}
          sharedTransitionStyle={avatarTransition}
        />

        {/* ── Name + Status ── */}
        <View style={styles.nameRow}>
          <Text style={styles.name}>{character.name}</Text>
          <StatusBadge status={character.status} />
        </View>

        {/* ── Character Fields ── */}
        <View style={styles.card}>
          <SectionTitle title="Character Info" />
          <InfoRow label="Species" value={character.species} />
          {character.type ? <InfoRow label="Type" value={character.type} /> : null}
          <InfoRow label="Gender" value={character.gender} />
          <InfoRow label="Created" value={createdDate} />
        </View>

        {/* ── Origin ── */}
        <View style={styles.card}>
          <SectionTitle title="Origin" />
          <InfoRow label="Name" value={character.origin.name} />
        </View>

        {/* ── Last Known Location ── */}
        <View style={styles.card}>
          <SectionTitle title="Last Known Location" />
          <InfoRow label="Name" value={character.location.name} />
        </View>

        {/* ── Episodes ── */}
        <View style={styles.card}>
          <SectionTitle title={`Episodes (${character.episode.length})`} />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.episodeList}
            accessibilityLabel="Episodes list"
            data={character.episode}
            keyExtractor={url => url}
            renderItem={({ item: url }) => {
              const match = url.match(/\/episode\/(\d+)$/);
              const episodeId = match ? Number(match[1]) : null;
              return (
                <TouchableOpacity
                  style={styles.episodeChip}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Go to ${episodeLabel(url)}`}
                  onPress={() => {
                    if (episodeId !== null) {
                      navigateToDetail(navigation, 'EpisodeDetail', { episodeId });
                    }
                  }}
                >
                  <Text style={styles.episodeText}>{episodeLabel(url)}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/**
 * Props for the internal {@link Header} sub-component.
 */
interface HeaderProps {
  /** Callback fired when the back button is pressed. */
  onBack: () => void;
  /** Screen title shown in the centre of the header. */
  title: string;
  /** Whether the character is currently saved as a favourite. */
  isFavourite: boolean;
  /** Callback fired when the favourite toggle button is pressed. */
  onToggle: () => void;
}

/**
 * Navigation header for the character detail screen.
 *
 * Contains a back button on the left, the character name in the centre, and a
 * heart icon toggle on the right that reflects and controls the favourite state.
 */
function Header({ onBack, title, isFavourite, onToggle }: HeaderProps) {
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

      <TouchableOpacity
        onPress={onToggle}
        style={styles.favBtn}
        accessibilityRole="button"
        accessibilityLabel={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        accessibilityState={{ checked: isFavourite }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Image
          source={isFavourite ? images.icFavouriteFilled : images.icFavourite}
          style={[styles.favIcon, isFavourite && styles.favIconActive]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

/**
 * Uppercase section title label used inside info cards.
 *
 * @param title - The label text to display.
 */
function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

/**
 * A single label/value row inside an info card.
 *
 * @param label - Left-aligned descriptor text (e.g. `"Species"`).
 * @param value - Right-aligned value text (e.g. `"Human"`).
 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  favBtn: {
    width: 36,
    alignItems: 'flex-end',
  },
  favIcon: {
    width: 26,
    height: 26,
    tintColor: '#ccc',
  },
  favIconActive: {
    tintColor: '#E53935',
  },

  // Scroll content
  scrollContent: {
    paddingBottom: 32,
  },

  // Avatar
  avatar: {
    width: '100%',
    height: 320,
    backgroundColor: '#e0e0e0',
  },

  // Name row
  nameRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ACCENT,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },

  // Episodes
  episodeList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  episodeChip: {
    backgroundColor: ACCENT + '18',
    borderWidth: 1.5,
    borderColor: ACCENT,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  episodeText: {
    fontSize: 13,
    color: ACCENT,
    fontWeight: '700',
  },
});
