import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  ListRenderItem,
  Text,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CharacterCard } from '../../../components/CharacterCard';
import { FilterBar } from '../../../components/FilterBar';
import { OfflineBanner } from '../../../components/OfflineBanner';
import { SearchBar } from '../../../components/SearchBar';
import { useCollapsibleControls } from '../../../hooks/useCollapsibleControls';
import { CharacterListEmpty, CharacterListFooter } from './CharacterListComponents';
import { useInfiniteCharacters } from '../../../hooks/useInfiniteCharacters';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import type { RootStackParamList, TabParamList } from '../../../navigation/AppNavigator';
import {
  setGenderFilter,
  setSearchFilter,
  setStatusFilter,
  useAppDispatch,
  useAppSelector,
} from '../../../store';
import type { DisplayGender, DisplayStatus } from '../../../store/slices/uiSlice';
import type { Character, CharacterFilters } from '../../../types/character';
import { styles } from './styles';

type TabProps = BottomTabScreenProps<TabParamList, 'CharacterList'>;
type StackNav = NativeStackScreenProps<RootStackParamList>['navigation'];
type Props = TabProps & { navigation: TabProps['navigation'] & StackNav };

/**
 * Converts a display-cased status value (e.g. `"Alive"`) to the lowercase
 * string expected by the Rick and Morty API filter params.
 *
 * @param s - Display status from the Redux UI slice.
 * @returns Lowercase API status string, or `undefined` when the value is empty.
 */
function toApiStatus(s: DisplayStatus): CharacterFilters['status'] | undefined {
  if (!s) return undefined;
  return s.toLowerCase() as CharacterFilters['status'];
}

/**
 * Converts a display-cased gender value (e.g. `"Male"`) to the lowercase
 * string expected by the Rick and Morty API filter params.
 *
 * @param g - Display gender from the Redux UI slice.
 * @returns Lowercase API gender string, or `undefined` when the value is empty.
 */
function toApiGender(g: DisplayGender): CharacterFilters['gender'] | undefined {
  if (!g) return undefined;
  return g.toLowerCase() as CharacterFilters['gender'];
}

/**
 * Main character list screen (Characters tab).
 *
 * Features:
 * - Infinite-scroll `FlatList` powered by {@link useInfiniteCharacters}.
 * - Redux-backed search, status, and gender filters persisted across tab
 *   switches.
 * - Collapsible header (search bar + filter chips) that hides on scroll.
 * - Loading, error, and empty states with appropriate UI feedback.
 *
 * @param props - Navigation props injected by the bottom tab + root stack navigators.
 */
export function CharacterListScreen({ navigation }: Props) {
  const { top } = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { isOnline } = useNetworkStatus();

  const search = useAppSelector(state => state.ui.characterFilters.search);
  const status = useAppSelector(state => state.ui.characterFilters.status);
  const gender = useAppSelector(state => state.ui.characterFilters.gender);

  const handleSearchChange = useCallback(
    (value: string) => dispatch(setSearchFilter(value)),
    [dispatch],
  );
  const handleStatusChange = useCallback(
    (value: DisplayStatus) => dispatch(setStatusFilter(value)),
    [dispatch],
  );
  const handleGenderChange = useCallback(
    (value: DisplayGender) => dispatch(setGenderFilter(value)),
    [dispatch],
  );
  const {
    controlsAnimatedStyle,
    controlsHeight,
    controlsPointerEvents,
    handleControlsLayout,
    handleScroll,
  } = useCollapsibleControls();

  const filters = useMemo<CharacterFilters>(
    () => ({
      name: search || undefined,
      status: toApiStatus(status),
      gender: toApiGender(gender),
    }),
    [search, status, gender],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteCharacters(filters);

  const characters = useMemo(
    () => data?.pages.flatMap(page => page.results) ?? [],
    [data],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem: ListRenderItem<Character> = useCallback(
    ({ item }) => <CharacterCard character={item} navigation={navigation} />,
    [navigation],
  );

  const keyExtractor = useCallback((item: Character) => String(item.id), []);

  const ListFooter = useCallback(
    () => <CharacterListFooter hasNextPage={!!hasNextPage} />,
    [hasNextPage],
  );

  const ListEmpty = useCallback(
    () => (
      <CharacterListEmpty
        isLoading={isLoading}
        isOnline={isOnline}
        isError={isError}
        error={error}
        onRetry={refetch}
      />
    ),
    [isLoading, isOnline, isError, error, refetch],
  );

  return (
    <View style={[styles.safeArea, { paddingTop: top }]}>
      <OfflineBanner visible={!isOnline} />
      <View style={styles.content}>
        <Animated.View
          onLayout={handleControlsLayout}
          pointerEvents={controlsPointerEvents}
          style={[styles.controls, controlsAnimatedStyle]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Characters</Text>
          </View>

          <SearchBar value={search} onChangeDebounced={handleSearchChange} />
          <FilterBar
            selectedStatus={status}
            selectedGender={gender}
            onStatusChange={handleStatusChange}
            onGenderChange={handleGenderChange}
          />
        </Animated.View>

        <FlatList
          data={characters}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate={0.985}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={[
            characters.length === 0 ? styles.emptyContainer : styles.listContent,
            { paddingTop: controlsHeight },
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
