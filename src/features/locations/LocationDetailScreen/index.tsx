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
import { CharacterAvatar } from '../../../components/CharacterAvatar';
import { OfflineBanner } from '../../../components/OfflineBanner';
import { AvatarGridSkeleton } from '../../../components/SkeletonLoader';
import { useLocationWithResidents } from '../../../hooks/useLocationWithResidents';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import type { Character } from '../../../types/character';
import { navigateToDetail } from '../../../utils/navigateToDetail';
import { Header, InfoRow, LoadingSkeleton } from './LocationDetailComponents';
import styles from './styles';
import images from '../../../assets/images';

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
  const { isOnline } = useNetworkStatus();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="" onBack={() => navigation.goBack()} />
        <LoadingSkeleton />
        <AvatarGridSkeleton count={9} />
      </SafeAreaView>
    );
  }

  if (isError || !location) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="" onBack={() => navigation.goBack()} />
        <OfflineBanner visible={!isOnline} />
        <View style={styles.centered}>
          {!isOnline ? (
            <Text style={styles.emptyText}>
              You're offline. Connect to the internet to view this location.
            </Text>
          ) : (
            <>
              <Text style={styles.errorText}>
                {(error as { message?: string })?.message ?? 'Failed to load location'}
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

      <OfflineBanner visible={!isOnline} />

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
