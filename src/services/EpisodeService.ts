import { get } from './ApiClient';
import type { Episode } from '../types/episode';
import type { PaginatedResponse } from '../types/api';

const BASE = '/episode';

export const EpisodeService = {
  getEpisodesPage: (page: number): Promise<PaginatedResponse<Episode>> =>
    get<PaginatedResponse<Episode>>(`${BASE}?page=${page}`),

  getEpisodeById: (id: number): Promise<Episode> =>
    get<Episode>(`${BASE}/${id}`),
};
