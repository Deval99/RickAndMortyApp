import { useQuery } from '@tanstack/react-query';
import { LocationService } from '../services/LocationService';
import { CharacterService } from '../services/CharacterService';
import type { FullLocation } from '../types/location';
import type { Character } from '../types/character';
import type { ApiError } from '../types/api';
import { useNetworkStatus } from './useNetworkStatus';

/** Extracts character ID from a URL like https://rickandmortyapi.com/api/character/5 */
function extractCharacterId(url: string): number {
  const match = url.match(/\/character\/(\d+)$/);
  return match ? parseInt(match[1] ?? '0', 10) : 0;
}

interface LocationWithResidents {
  location: FullLocation | undefined;
  residents: Character[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export function useLocationWithResidents(locationId: number): LocationWithResidents {
  const { isOnline, isChecking } = useNetworkStatus();
  const canFetch = !isChecking && isOnline;

  const locationQuery = useQuery<FullLocation, ApiError>({
    queryKey: ['location', locationId],
    queryFn: () => LocationService.getLocationById(locationId),
    enabled: canFetch,
    retry: canFetch ? 2 : false,
    staleTime: canFetch ? 1000 * 60 * 5 : Infinity,
  });

  const characterIds = (locationQuery.data?.residents ?? [])
    .map(extractCharacterId)
    .filter(id => id > 0);

  const residentsQuery = useQuery<Character[], ApiError>({
    queryKey: ['characters', 'batch', characterIds],
    queryFn: async () => {
      if (characterIds.length === 0) return [];
      if (characterIds.length === 1) {
        const single = await CharacterService.getCharacterById(characterIds[0] ?? 0);
        return [single];
      }
      const { get } = await import('../services/ApiClient');
      const result = await get<Character[]>(`/character/${characterIds.join(',')}`);
      return result;
    },
    enabled: canFetch && locationQuery.isSuccess && characterIds.length > 0,
    retry: canFetch ? 2 : false,
    staleTime: canFetch ? 1000 * 60 * 5 : Infinity,
  });

  const isLoading =
    locationQuery.isLoading ||
    (locationQuery.isSuccess && characterIds.length > 0 && residentsQuery.isLoading);
  const isError = locationQuery.isError || residentsQuery.isError;
  const error = (locationQuery.error ?? residentsQuery.error) as ApiError | null;

  return {
    location: locationQuery.data,
    residents: residentsQuery.data ?? [],
    isLoading,
    isError,
    error,
    refetch: () => {
      locationQuery.refetch();
      residentsQuery.refetch();
    },
  };
}
