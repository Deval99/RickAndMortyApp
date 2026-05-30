import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CharacterService } from '../services/CharacterService';
import type { ApiError } from '../types/api';
import type { Character } from '../types/character';
import { useNetworkStatus } from './useNetworkStatus';
import { useAppSelector } from '../store/hooks';
import { DatabaseService } from '../database/DatabaseService';

/**
 * Fetches a single character by ID.
 *
 * Offline behaviour:
 * - When the device is offline AND the character is in the user's favourites
 *   (i.e. it was previously cached in SQLite), the query falls back to the
 *   local database instead of hitting the network.
 * - When offline and NOT a favourite, the query is disabled so React Query
 *   doesn't attempt a doomed network call; the caller receives `isError: true`
 *   with a friendly "You're offline" message.
 */
export function useCharacter(characterId: number): UseQueryResult<Character, ApiError> {
  const { isOnline, isChecking } = useNetworkStatus();
  const isFavourite = useAppSelector(state =>
    state.favourites.ids.includes(characterId),
  );
  const canFetch = !isChecking && (isOnline || isFavourite);

  return useQuery<Character, ApiError>({
    queryKey: ['character', characterId],
    queryFn: async () => {
      // Offline + cached in SQLite → serve from local DB
      if (!isOnline && isFavourite) {
        const cached = await DatabaseService.getCharacterById(characterId);
        if (cached) return cached;
      }
      return CharacterService.getCharacterById(characterId);
    },
    staleTime: isOnline ? 1000 * 60 * 5 : Infinity,
    retry: isOnline ? 2 : false,
    enabled: canFetch,
    placeholderData: undefined,
  });
}
