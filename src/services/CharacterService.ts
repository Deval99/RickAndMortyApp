import { get } from './ApiClient';
import type { Character } from '../types/character';
import type { PaginatedResponse } from '../types/api';

const BASE = '/character';

export interface CharacterFilters {
  page?: number;
  name?: string;
  status?: 'Alive' | 'Dead' | 'unknown' | '';
  gender?: 'Female' | 'Male' | 'Genderless' | 'unknown' | '';
}

export const CharacterService = {
  getCharacters: (filters: CharacterFilters = {}): Promise<PaginatedResponse<Character>> => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.name) params.set('name', filters.name);
    if (filters.status) params.set('status', filters.status);
    if (filters.gender) params.set('gender', filters.gender);
    const query = params.toString();
    return get<PaginatedResponse<Character>>(`${BASE}${query ? `?${query}` : ''}`);
  },

  getCharacterById: (id: number): Promise<Character> =>
    get<Character>(`${BASE}/${id}`),
};
