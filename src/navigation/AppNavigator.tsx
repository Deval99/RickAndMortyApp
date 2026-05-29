import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image } from 'react-native';
import images from '../assets/images';
import { CharacterDetailScreen } from '../features/characters/CharacterDetailScreen';
import { CharacterListScreen } from '../features/characters/CharacterListScreen';
import { EpisodeDetailScreen } from '../features/episodes/EpisodeDetailScreen';
import { EpisodeListScreen } from '../features/episodes/EpisodeListScreen';
import { FavouritesScreen } from '../features/favourites/FavouritesScreen';
import { LocationDetailScreen } from '../features/locations/LocationDetailScreen';
import { LocationListScreen } from '../features/locations/LocationListScreen';
import { setActiveTab } from '../store';
import { useAppDispatch } from '../store/hooks';

// ─── Param lists ─────────────────────────────────────────────────────────────

/** Root stack — shared across all tabs */
export type RootStackParamList = {
  Tabs: undefined;
  CharacterDetail: { characterId: number };
  EpisodeDetail: { episodeId: number };
  LocationDetail: { locationId: number };
};

/** Bottom tab param list */
export type TabParamList = {
  CharacterList: undefined;
  EpisodesPaginated: undefined;
  LocationList: undefined;
  Favourites: undefined;
};

// ─── Navigators ──────────────────────────────────────────────────────────────

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<string, ReturnType<typeof require>> = {
  Characters: images.icCharacter,
  Episodes: images.icEpisodes,
  Locations: images.icLocation,
  Favourites: images.icFavouriteFilled,
};

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const source = TAB_ICONS[label] ?? images.icCharacter;
  return (
    <Image
      source={source}
      style={{ width: 24, height: 24, opacity: focused ? 1 : 0.8 }}
      resizeMode="contain"
    />
  );
}

function TabNavigator() {
  const dispatch = useAppDispatch();

  return (
    <Tab.Navigator
      screenListeners={{
        tabPress: e => {
          // e.target is "ScreenName-<key>"; extract the screen name before the dash
          const tabName = (e.target ?? '').split('-')[0] as keyof TabParamList;
          if (tabName) {
            dispatch(setActiveTab(tabName));
          }
        },
      }}
      screenOptions={({ route }: { route: { name: keyof TabParamList } }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00b5cc',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e8e8e8',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          let label = 'Characters';
          if (route.name === 'EpisodesPaginated') label = 'Episodes';
          if (route.name === 'LocationList') label = 'Locations';
          if (route.name === 'Favourites') label = 'Favourites';
          return <TabIcon label={label} focused={focused} />;
        },
      })}
    >
      <Tab.Screen
        name="CharacterList"
        component={CharacterListScreen}
        options={{ tabBarLabel: 'Characters' }}
      />
      <Tab.Screen
        name="EpisodesPaginated"
        component={EpisodeListScreen}
        options={{ tabBarLabel: 'Episodes' }}
      />
      <Tab.Screen
        name="LocationList"
        component={LocationListScreen}
        options={{ tabBarLabel: 'Locations' }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{ tabBarLabel: 'Favourites' }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
        <Stack.Screen name="EpisodeDetail" component={EpisodeDetailScreen} />
        <Stack.Screen name="LocationDetail" component={LocationDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
