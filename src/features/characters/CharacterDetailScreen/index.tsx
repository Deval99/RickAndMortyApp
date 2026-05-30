import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { SharedTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OfflineBanner } from '../../../components/OfflineBanner';
import { StatusBadge } from '../../../components/StatusBadge';
import { useCharacter } from '../../../hooks/useCharacter';
import { useFavourite } from '../../../hooks/useFavourite';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import { navigateToDetail } from '../../../utils/navigateToDetail';
import {
  ErrorView,
  Header,
  InfoRow,
  LoadingView,
  SectionTitle,
} from './CharacterDetailComponents';
import styles from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'CharacterDetail'>;

const avatarTransition = SharedTransition.createInstance()
  .springify()
  .damping(20)
  .stiffness(200);

/**
 * Extracts the episode number from a Rick and Morty API episode URL and
 * returns a short label like `"EP 28"`.
 */
function episodeLabel(url: string): string {
  const match = url.match(/\/episode\/(\d+)$/);
  return match ? `EP ${match[1]}` : url;
}

/**
 * Character detail screen.
 *
 * Displays a large avatar (with a shared-element spring transition from the
 * list), character metadata cards, a horizontal episode chip list, and a
 * favourite toggle button in the header.
 */
export function CharacterDetailScreen({ route, navigation }: Props) {
  const { characterId } = route.params;
  const { data: character, isLoading, isError, error, refetch } = useCharacter(characterId);
  const { isFavourite, toggle } = useFavourite(characterId, character);
  const { isOnline } = useNetworkStatus();

  const emptyHeader = (
    <Header onBack={() => navigation.goBack()} title="" isFavourite={false} onToggle={() => {}} />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {emptyHeader}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LoadingView />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError || !character) {
    const offlineAndNotCached = !isOnline;
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {emptyHeader}
        <ErrorView
          error={
            offlineAndNotCached
              ? { message: "You're offline and this character isn't saved in your favourites. Add it as a favourite while online to view it offline." }
              : error
          }
          onRetry={refetch}
          showRetry={isOnline}
          isOffline={offlineAndNotCached}
        />
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

      <OfflineBanner visible={!isOnline} />

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
          <InfoRow label="Origin" value={character.origin.name} />
          <InfoRow label="Last Known Location" value={character.location.name} />
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
