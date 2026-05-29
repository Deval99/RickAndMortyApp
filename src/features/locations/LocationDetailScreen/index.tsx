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
import images from '../../../assets/images';
import { CharacterAvatar } from '../../../components/CharacterAvatar';
import { AvatarGridSkeleton } from '../../../components/SkeletonLoader';
import { useLocationWithResidents } from '../../../hooks/useLocationWithResidents';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import type { Character } from '../../../types/character';
import { navigateToDetail } from '../../../utils/navigateToDetail';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationDetail'>;

const ACCENT = '#00b5cc';

/**
 * Location detail screen.
 *
 * Displays a meta card with the location name, type, and dimension, followed
 * by a 3-column grid of {@link CharacterAvatar} cards for every resident.
 *
 * Handles loading, error, and success states independently.
 *
 * @param props - Navigation props injected by the root stack navigator.
 */
export function LocationDetailScreen({ route, navigation }: Props) {
  const { locationId } = route.params;
  const { location, residents, isLoading, isError, error, refetch } =
    useLocationWithResidents(locationId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="" onBack={() => navigation.goBack()} />
        {/* Meta card skeleton */}
        <View style={[styles.metaCard, { gap: 10 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#e0e0e0' }} />
            <View style={{ flex: 1, gap: 6 }}>
              <View style={{ width: '60%', height: 18, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
            </View>
          </View>
          <View style={{ width: '100%', height: 1, backgroundColor: '#f0f0f0' }} />
          {[1, 2].map(i => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '30%', height: 14, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
              <View style={{ width: '45%', height: 14, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
            </View>
          ))}
        </View>
        <AvatarGridSkeleton count={9} />
      </SafeAreaView>
    );
  }

  if (isError || !location) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {(error as { message?: string })?.message ?? 'Failed to load location'}
          </Text>
          <TouchableOpacity onPress={() => refetch()} accessibilityRole="button">
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

  const ListHeader = (
    <>
      {/* Meta card */}
      <View style={styles.metaCard}>
        <View style={styles.metaIconRow}>
          <View style={styles.metaIconCircle}>
            <Image source={images.icLocation} style={styles.metaIcon} resizeMode="contain" />
          </View>
          <View style={styles.metaTextBlock}>
            <Text style={styles.metaName}>{location.name}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <InfoRow label="Type" value={location.type || 'Unknown'} />
        <InfoRow label="Dimension" value={location.dimension || 'Unknown'} />

        <View style={styles.residentCountRow}>
          <Text style={styles.residentCountLabel}>
            {location.residents.length} resident{location.residents.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Residents section header */}
      {location.residents.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Residents</Text>
        </View>
      )}

      {/* Empty residents state */}
      {location.residents.length === 0 && (
        <View style={styles.noResidents}>
          <Text style={styles.noResidentsText}>No known residents</Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title={location.name} onBack={() => navigation.goBack()} />

      <FlatList
        data={residents}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={residents.length > 0 ? styles.columnWrapper : undefined}
      />
    </SafeAreaView>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/**
 * Props for the internal {@link Header} sub-component.
 */
interface HeaderProps {
  /** Screen title shown in the centre of the header. */
  title: string;
  /** Callback fired when the back button is pressed. */
  onBack: () => void;
}

/**
 * Navigation header for the location detail screen.
 *
 * Contains a back button on the left and the location name centred in the bar.
 */
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

/**
 * A single label/value row inside the location meta card.
 *
 * @param label - Left-aligned descriptor text (e.g. `"Type"`).
 * @param value - Right-aligned value text (e.g. `"Planet"`).
 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

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
    marginTop: 8,
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
  metaIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: ACCENT + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaIcon: {
    width: 28,
    height: 28,
    tintColor: ACCENT,
  },
  metaTextBlock: {
    flex: 1,
  },
  metaName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#f0f0f0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 4,
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
  residentCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  residentCountLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },

  // Section header
  sectionHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ACCENT,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // No residents
  noResidents: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noResidentsText: {
    fontSize: 15,
    color: '#888',
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
