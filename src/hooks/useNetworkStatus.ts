import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export interface NetworkStatus {
  /** `true` when the device has an active internet connection. */
  isOnline: boolean;
  /** `true` until the first NetInfo event has been received. */
  isChecking: boolean;
}

/**
 * Subscribes to device network state and returns a live `isOnline` flag.
 *
 * - Starts as `isChecking: true` until the first event arrives.
 * - Considers the device online only when `isConnected` AND
 *   `isInternetReachable` are both truthy (or `isInternetReachable` is null,
 *   which means the platform doesn't report it).
 */
export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsOnline(resolveOnline(state));
      setIsChecking(false);
    });

    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOnline(resolveOnline(state));
      setIsChecking(false);
    });

    return unsubscribe;
  }, []);

  return { isOnline, isChecking };
}

function resolveOnline(state: NetInfoState): boolean {
  if (!state.isConnected) return false;
  // null means the platform doesn't report reachability — treat as online
  if (state.isInternetReachable === false) return false;
  return true;
}
