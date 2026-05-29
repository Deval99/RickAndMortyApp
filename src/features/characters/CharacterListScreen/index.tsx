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
import { SearchBar } from '../../../components/SearchBar';
import { CharacterCardSkeleton, CharacterListSkeleton } from '../../../components/SkeletonLoader';
import { useCollapsibleControls } from '../../../hooks/useCollapsibleControls';
import { useInfiniteCharacters } from '../../../hooks/useInfiniteCharacters';
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

// Tab screen props combined with root stack navigation for cross-stack navigation
type TabProps = BottomTabScreenProps<TabParamList, 'CharacterList'>;
type StackNav = NativeStackScreenProps<RootStackParamList>['navigation'];
type Props = TabProps & { navigation: TabProps['navigation'] & StackNav };

// FilterBar uses display-cased values from Character; map them to lowercase API params
function toApiStatus(s: DisplayStatus): CharacterFilters['status'] | undefined {
  if (!s) return undefined;
  return s.toLowerCase() as CharacterFilters['status'];
}

function toApiGender(g: DisplayGender): CharacterFilters['gender'] | undefined {
  if (!g) return undefined;
  return g.toLowerCase() as CharacterFilters['gender'];
}

export function CharacterListScreen({ navigation }: Props) {
  const { top } = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  // ── Filters from Redux (global UI state) ──────────────────────────────────
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

  const ListFooter = () => {
    if (!hasNextPage) return null;
    return <CharacterCardSkeleton />;
  };

  const ListEmpty = () => {
    if (isLoading) {
      return <CharacterListSkeleton count={6} />;
    }
    if (isError) {
      const is404 = (error as { statusCode?: number })?.statusCode === 404;
      if (is404) {
        return (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No data found</Text>
          </View>
        );
      }
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {(error as { message?: string })?.message ?? 'Something went wrong'}
          </Text>
          <Text style={styles.retryText} onPress={() => refetch()}>
            Tap to retry
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No characters found</Text>
      </View>
    );
  };

  return (
    <View style={[styles.safeArea, { paddingTop: top }]}>
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
