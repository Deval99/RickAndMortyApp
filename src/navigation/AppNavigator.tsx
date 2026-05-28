import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CharacterListScreen } from '../screens/CharacterListScreen';

export type RootStackParamList = {
  CharacterList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CharacterList" component={CharacterListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
