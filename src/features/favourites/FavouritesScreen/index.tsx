import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  Text,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import images from '../../../assets/images';
import { CharacterCard } from '../../../components/CharacterCard';
import { OfflineBanner } from '../../../components/OfflineBanner';
import { CharacterListSkeleton } from '../../../components/SkeletonLoader';
import { useCollapsibleControls } from '../../../hooks/useCollapsibleControls';
import { useFavourites } from '../../../hooks/useFavourites';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import type { RootStackParamList, TabParamList } from '../../../navigation/AppNavigator';
import type { Character } from '../../../types/character';
import styles from './styles';

type TabProps = BottomTabScreenProps<TabParamList, 'Favourites'>;
type StackNav = NativeStackScreenProps<RootStackParamList>['navigation'];
type Props = TabProps & { navigation: TabProps['navigation'] & StackNav };

/**
 * Favourites screen (Favourites tab).
 *
 * Displays the list of characters the user has saved locally via SQLite.
 * The list reloads every time the tab comes into focus so removals made on
 * the character detail screen are reflected immediately.
 *
 * Shows a loading skeleton while the database query runs and an illustrated
 * empty state when no favourites have been saved yet.
 *
 * @param props - Navigation props injected by the bottom tab + root stack navigators.
 */
export function FavouritesScreen({ navigation }: Props) {
  const { top } = useSafeAreaInsets();
  const { characters, isLoading, reload } = useFavourites();
  const { isOnline } = useNetworkStatus();
  const {
    controlsAnimatedStyle,
    controlsHeight,
    controlsPointerEvents,
    handleControlsLayout,
    handleScroll,
  } = useCollapsibleControls();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', reload);
    return unsubscribe;
  }, [navigation, reload]);

  const renderItem: ListRenderItem<Character> = useCallback(
    ({ item }) => <CharacterCard character={item} navigation={navigation} />,
    [navigation],
  );

  const keyExtractor = useCallback((item: Character) => String(item.id), []);

  if (isLoading) {
    return (
      <View style={[styles.safeArea, { paddingTop: top }]}>
        <OfflineBanner visible={!isOnline} />
        <Header />
        <CharacterListSkeleton count={4} />
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
          <Header />
        </Animated.View>

        <FlatList
          data={characters}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={[
            characters.length === 0 ? styles.emptyContainer : styles.listContent,
            { paddingTop: controlsHeight },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState />}
        />
      </View>
    </View>
  );
}

/**
 * Static header that displays the "Favourites" screen title.
 */
function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Favourites</Text>
    </View>
  );
}

/**
 * Illustrated empty state shown when the user has not saved any favourites yet.
 *
 * Displays a heart icon, a title, and a short instructional subtitle.
 */
function EmptyState() {
  return (
    <View style={styles.centered}>
      <Image source={images.icFavourite} style={styles.emptyIcon} resizeMode="contain" />
      <Text style={styles.emptyTitle}>No favourites yet</Text>
      <Text style={styles.emptySubtitle}>
        Open a character and tap the heart to save them here.{'\n'}
        They'll be available even without internet.
      </Text>
    </View>
  );
}



