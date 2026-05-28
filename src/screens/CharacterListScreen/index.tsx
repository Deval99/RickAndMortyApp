import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CharacterCard } from '../../components/CharacterCard';
import { FilterBar } from '../../components/FilterBar';
import { SearchBar } from '../../components/SearchBar';
import { useInfiniteCharacters } from '../../hooks/useInfiniteCharacters';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import type { Character } from '../../types/character';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'CharacterList'>;

type Status = Character['status'] | '';
type Gender = Character['gender'] | '';

export function CharacterListScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Status>('');
  const [gender, setGender] = useState<Gender>('');

  const filters = useMemo(
    () => ({
      name: search || undefined,
      status: (status || undefined) as Character['status'] | undefined,
      gender: (gender || undefined) as Character['gender'] | undefined,
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
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#00b5cc" />
      </View>
    );
  };

  const ListEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00b5cc" />
        </View>
      );
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
    </SafeAreaView>
  );
}
