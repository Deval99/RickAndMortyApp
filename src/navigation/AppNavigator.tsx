import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CharacterDetailScreen } from '../screens/CharacterDetailScreen';
import { CharacterListScreen } from '../screens/CharacterListScreen';

export type RootStackParamList = {
  CharacterList: undefined;
  CharacterDetail: { characterId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CharacterList" component={CharacterListScreen} />
        <Stack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
