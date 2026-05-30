import { CommonActions, StackActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/**
 * Navigate to a detail screen without growing the stack indefinitely.
 *
 * - If the target screen already exists in the stack, pop back to it and
 *   replace its params by resetting the stack up to that point.
 * - If it doesn't exist yet, push a fresh instance.
 */
export function navigateToDetail<RouteName extends 'CharacterDetail' | 'EpisodeDetail'>(
  navigation: Nav,
  routeName: RouteName,
  params: RootStackParamList[RouteName],
): void {
  const state = navigation.getState();
  const routes = state?.routes ?? [];

  const existingIndex = [...routes].reverse().findIndex(r => r.name === routeName);

  if (existingIndex !== -1) {
    const forwardIndex = routes.length - 1 - existingIndex;

    type RouteEntry = (typeof routes)[number];
    const newRoutes = routes.slice(0, forwardIndex + 1).map((r: RouteEntry, i: number) =>
      i === forwardIndex ? { ...r, params } : r,
    );

    navigation.dispatch({
      ...CommonActions.reset({ ...state, routes: newRoutes, index: newRoutes.length - 1 }),
      target: state.key,
    });
  } else {
    navigation.dispatch(StackActions.push(routeName, params));
  }
}
