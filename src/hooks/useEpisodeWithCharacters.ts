import { useQuery } from '@tanstack/react-query';
import { EpisodeService } from '../services/EpisodeService';
import { CharacterService } from '../services/CharacterService';
import type { Episode } from '../types/episode';
import type { Character } from '../types/character';
import type { ApiError } from '../types/api';

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
  // Step 1: fetch the episode
  const episodeQuery = useQuery<Episode, ApiError>({
    queryKey: ['episode', episodeId],
    queryFn: () => EpisodeService.getEpisodeById(episodeId),
  });

  const characterIds = (episodeQuery.data?.characters ?? [])
    .map(extractCharacterId)
    .filter(id => id > 0);

  // Step 2: fetch all characters in one batch request (API supports comma-separated IDs)
  const charactersQuery = useQuery<Character[], ApiError>({
    queryKey: ['characters', 'batch', characterIds],
    queryFn: async () => {
      if (characterIds.length === 0) return [];
      if (characterIds.length === 1) {
        const single = await CharacterService.getCharacterById(characterIds[0] ?? 0);
        return [single];
      }
      // Rick and Morty API supports /character/[1,2,3] for batch fetching
      const { get } = await import('../services/ApiClient');
      const result = await get<Character[]>(`/character/${characterIds.join(',')}`);
      return result;
    },
    enabled: episodeQuery.isSuccess && characterIds.length > 0,
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
