import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { LocationService } from '../services/LocationService';
import type { FullLocation } from '../types/location';
import type { ApiError } from '../types/api';
import { useNetworkStatus } from './useNetworkStatus';

export function useLocation(locationId: number): UseQueryResult<FullLocation, ApiError> {
  const { isOnline, isChecking } = useNetworkStatus();
  const canFetch = !isChecking && isOnline;

  return useQuery<FullLocation, ApiError>({
    queryKey: ['location', locationId],
    queryFn: () => LocationService.getLocationById(locationId),
    enabled: canFetch,
    retry: canFetch ? 2 : false,
    staleTime: canFetch ? 1000 * 60 * 5 : Infinity,
  });
}
