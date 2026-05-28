import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CharacterService } from '../services/CharacterService';
import type { Character } from '../types/character';
import type { ApiError } from '../types/api';

export function useCharacter(characterId: number): UseQueryResult<Character, ApiError> {
  return useQuery<Character, ApiError>({
    queryKey: ['character', characterId],
    queryFn: () => CharacterService.getCharacterById(characterId),
  });
}
