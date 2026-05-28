import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { CharacterDetailScreen } from '../screens/CharacterDetailScreen';
import { CharacterListScreen } from '../screens/CharacterListScreen';
import { EpisodeDetailScreen } from '../screens/EpisodeDetailScreen';
import { EpisodeListScreen } from '../screens/EpisodeListScreen';
import { FavouritesScreen } from '../screens/FavouritesScreen';
import { LocationDetailScreen } from '../screens/LocationDetailScreen';
import { LocationListScreen } from '../screens/LocationListScreen';

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

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Characters: '👤',
    Episodes: '📺',
    Locations: '🌍',
    Favourites: '♥',
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
      {icons[label] ?? '●'}
    </Text>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
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
