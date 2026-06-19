import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import StatsScreen from './screens/StatsScreen';
import { Difficulty } from './types/game.types';

export type RootStackParamList = {
  Home: undefined;
  Game: { difficulty: Difficulty };
  Stats: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#4A90D9' },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Memory Game', headerLeft: () => null }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: 'Jogando', headerBackTitle: 'Sair' }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{ title: 'Estatísticas' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
