import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { LocationService } from '../services/LocationService';
import type { RMLocation } from '../types/location';
import type { ApiError } from '../types/api';

export function useLocation(locationId: number): UseQueryResult<RMLocation, ApiError> {
  return useQuery<RMLocation, ApiError>({
    queryKey: ['location', locationId],
    queryFn: () => LocationService.getLocationById(locationId),
  });
}
