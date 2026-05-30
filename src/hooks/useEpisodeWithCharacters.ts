import { useQuery } from '@tanstack/react-query';
import { EpisodeService } from '../services/EpisodeService';
import { CharacterService } from '../services/CharacterService';
import type { Episode } from '../types/episode';
import type { Character } from '../types/character';
import type { ApiError } from '../types/api';
import { useNetworkStatus } from './useNetworkStatus';

/** Extracts character ID from a URL like https://rickandmortyapi.com/api/character/5 */
function extractCharacterId(url: string): number {
  const match = url.match(/\/character\/(\d+)$/);
  return match ? parseInt(match[1] ?? '0', 10) : 0;
}

interface EpisodeWithCharacters {
  episode: Episode | undefined;
  characters: Character[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export function useEpisodeWithCharacters(episodeId: number): EpisodeWithCharacters {
  const { isOnline, isChecking } = useNetworkStatus();
  const canFetch = !isChecking && isOnline;

  const episodeQuery = useQuery<Episode, ApiError>({
    queryKey: ['episode', episodeId],
    queryFn: () => EpisodeService.getEpisodeById(episodeId),
    enabled: canFetch,
    retry: canFetch ? 2 : false,
    staleTime: canFetch ? 1000 * 60 * 5 : Infinity,
  });

  const characterIds = (episodeQuery.data?.characters ?? [])
    .map(extractCharacterId)
    .filter(id => id > 0);

  const charactersQuery = useQuery<Character[], ApiError>({
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
    enabled: canFetch && episodeQuery.isSuccess && characterIds.length > 0,
    retry: canFetch ? 2 : false,
    staleTime: canFetch ? 1000 * 60 * 5 : Infinity,
  });

  const isLoading = episodeQuery.isLoading || (episodeQuery.isSuccess && charactersQuery.isLoading);
  const isError = episodeQuery.isError || charactersQuery.isError;
  const error = (episodeQuery.error ?? charactersQuery.error) as ApiError | null;

  return {
    episode: episodeQuery.data,
    characters: charactersQuery.data ?? [],
    isLoading,
    isError,
    error,
    refetch: () => {
      episodeQuery.refetch();
      charactersQuery.refetch();
    },
  };
}
