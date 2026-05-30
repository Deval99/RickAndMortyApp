import { useInfiniteQuery, UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';
import { LocationService } from '../services/LocationService';
import type { FullLocation } from '../types/location';
import type { ApiError, PaginatedResponse } from '../types/api';
import { useNetworkStatus } from './useNetworkStatus';

function getNextPageParam(
  lastPage: Pick<PaginatedResponse<unknown>, 'info'>,
): number | undefined {
  if (lastPage.info.next === null) return undefined;
  const url = new URL(lastPage.info.next);
  const page = url.searchParams.get('page');
  return page !== null ? Number(page) : undefined;
}

export function useInfiniteLocations(): UseInfiniteQueryResult<
  InfiniteData<PaginatedResponse<FullLocation>>,
  ApiError
> {
  const { isOnline, isChecking } = useNetworkStatus();

  return useInfiniteQuery<PaginatedResponse<FullLocation>, ApiError>({
    queryKey: ['locations', 'infinite'],
    queryFn: ({ pageParam }) => LocationService.getLocationsPage(pageParam as number),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !isChecking && isOnline,
  });
}
