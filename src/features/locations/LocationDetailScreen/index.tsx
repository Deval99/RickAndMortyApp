import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
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
import styles, { ACCENT } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationDetail'>;

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

