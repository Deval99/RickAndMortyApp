import { get } from './ApiClient';
import type { FullLocation } from '../types/location';
import type { PaginatedResponse } from '../types/api';

const BASE = '/location';

export const LocationService = {
  getLocationsPage: (page: number): Promise<PaginatedResponse<FullLocation>> =>
    get<PaginatedResponse<FullLocation>>(`${BASE}?page=${page}`),

  getLocationById: (id: number): Promise<FullLocation> =>
    get<FullLocation>(`${BASE}/${id}`),
};
