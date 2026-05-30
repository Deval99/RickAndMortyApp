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
import { OfflineBanner } from '../../../components/OfflineBanner';
import { AvatarGridSkeleton } from '../../../components/SkeletonLoader';
import { useEpisodeWithCharacters } from '../../../hooks/useEpisodeWithCharacters';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import type { Character } from '../../../types/character';
import { navigateToDetail } from '../../../utils/navigateToDetail';
import styles from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'EpisodeDetail'>;

/**
 * Episode detail screen.
 *
 * Displays a meta card with the episode code, name, and air date, followed by
 * a 3-column grid of {@link CharacterAvatar} cards for every character that
 * appears in the episode.
 *
 * Handles loading, error, and success states independently.
 *
 * @param props - Navigation props injected by the root stack navigator.
 */
export function EpisodeDetailScreen({ route, navigation }: Props) {
  const { episodeId } = route.params;
  const { episode, characters, isLoading, isError, error, refetch } =
    useEpisodeWithCharacters(episodeId);
  const { isOnline } = useNetworkStatus();

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
        <OfflineBanner visible={!isOnline} />
        <View style={styles.centered}>
          {!isOnline ? (
            <Text style={styles.emptyText}>
              You're offline. Connect to the internet to view this episode.
            </Text>
          ) : (
            <>
              <Text style={styles.errorText}>
                {(error as { message?: string })?.message ?? 'Failed to load episode'}
              </Text>
              <TouchableOpacity onPress={() => refetch()} accessibilityRole="button">
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            </>
          )}
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

      <OfflineBanner visible={!isOnline} />

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

interface HeaderProps {
  /** Screen title shown in the centre of the header. */
  title: string;
  /** Callback fired when the back button is pressed. */
  onBack: () => void;
}

/**
 * Navigation header for the episode detail screen.
 *
 * Contains a back button on the left and the episode name centred in the bar.
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

