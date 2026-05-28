import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CharacterCard } from '../../components/CharacterCard';
import { FilterBar } from '../../components/FilterBar';
import { SearchBar } from '../../components/SearchBar';
import { CharacterListSkeleton } from '../../components/SkeletonLoader';
import { useInfiniteCharacters } from '../../hooks/useInfiniteCharacters';
import type { RootStackParamList, TabParamList } from '../../navigation/AppNavigator';
import type { Character, CharacterFilters } from '../../types/character';
import { styles } from './styles';

// Tab screen props combined with root stack navigation for cross-stack navigation
type TabProps = BottomTabScreenProps<TabParamList, 'CharacterList'>;
type StackNav = NativeStackScreenProps<RootStackParamList>['navigation'];
type Props = TabProps & { navigation: TabProps['navigation'] & StackNav };

// FilterBar uses display-cased values from Character; map them to lowercase API params
type DisplayStatus = Character['status'] | '';
type DisplayGender = Character['gender'] | '';

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
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<DisplayStatus>('');
  const [gender, setGender] = useState<DisplayGender>('');

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
    if (!isFetchingNextPage) return null;
    return <View style={styles.footer} />;
  };

  const ListEmpty = () => {
    if (isLoading) {
      return <CharacterListSkeleton count={6} />;
    }
    if (isError) {
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
      <View style={styles.header}>
        <Text style={styles.title}>Characters</Text>
      </View>

      <SearchBar value={search} onChangeDebounced={setSearch} />
      <FilterBar
        selectedStatus={status}
        selectedGender={gender}
        onStatusChange={setStatus}
        onGenderChange={setGender}
      />

      <FlatList
        data={characters}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        decelerationRate={0.985}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={
          characters.length === 0 ? styles.emptyContainer : styles.listContent
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
