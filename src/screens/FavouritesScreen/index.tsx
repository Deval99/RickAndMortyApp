import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../assets/images';
import { CharacterCard } from '../../components/CharacterCard';
import { useFavourites } from '../../hooks/useFavourites';
import type { RootStackParamList, TabParamList } from '../../navigation/AppNavigator';
import type { Character } from '../../types/character';

type TabProps = BottomTabScreenProps<TabParamList, 'Favourites'>;
type StackNav = NativeStackScreenProps<RootStackParamList>['navigation'];
type Props = TabProps & { navigation: TabProps['navigation'] & StackNav };

export function FavouritesScreen({ navigation }: Props) {
  const { characters, isLoading, reload } = useFavourites();

  // Reload whenever the tab comes into focus so removals on the detail screen
  // are reflected immediately.
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
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00b5cc" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />
      <FlatList
        data={characters}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={
          characters.length === 0 ? styles.emptyContainer : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
      />
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Favourites</Text>
    </View>
  );
}

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    tintColor: '#E53935',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});
