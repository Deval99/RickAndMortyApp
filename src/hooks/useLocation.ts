import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { LocationService } from '../services/LocationService';
import type { FullLocation } from '../types/location';
import type { ApiError } from '../types/api';

export function useLocation(locationId: number): UseQueryResult<FullLocation, ApiError> {
  return useQuery<FullLocation, ApiError>({
    queryKey: ['location', locationId],
    queryFn: () => LocationService.getLocationById(locationId),
  });
}
