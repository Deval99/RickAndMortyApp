import { get } from './ApiClient';
import type { RMLocation } from '../types/location';
import type { PaginatedResponse } from '../types/api';

const BASE = '/location';

export const LocationService = {
  getLocationsPage: (page: number): Promise<PaginatedResponse<RMLocation>> =>
    get<PaginatedResponse<RMLocation>>(`${BASE}?page=${page}`),

  getLocationById: (id: number): Promise<RMLocation> =>
    get<RMLocation>(`${BASE}/${id}`),
};
