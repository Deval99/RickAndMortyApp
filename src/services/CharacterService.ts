import { get } from './ApiClient';
import type { Character, CharacterFilters } from '../types/character';
import type { PaginatedResponse } from '../types/api';

const BASE = '/character';

export type { CharacterFilters };

export const CharacterService = {
  getCharacters: (
    page: number,
    filters: Omit<CharacterFilters, 'page'> = {},
  ): Promise<PaginatedResponse<Character>> => {
    const params = new URLSearchParams({ page: String(page) });
    if (filters.name) params.set('name', filters.name);
    if (filters.status) params.set('status', filters.status);
    if (filters.species) params.set('species', filters.species);
    if (filters.gender) params.set('gender', filters.gender);
    return get<PaginatedResponse<Character>>(`${BASE}?${params.toString()}`);
  },

  getCharacterById: (id: number): Promise<Character> =>
    get<Character>(`${BASE}/${id}`),
};
