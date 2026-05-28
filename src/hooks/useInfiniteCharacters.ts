import { useInfiniteQuery, UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';
import { CharacterService } from '../services/CharacterService';
import type { CharacterFilters } from '../services/CharacterService';
import type { Character } from '../types/character';
import type { ApiError, PaginatedResponse } from '../types/api';

export function getNextPageParam(
  lastPage: Pick<PaginatedResponse<unknown>, 'info'>,
): number | undefined {
  if (lastPage.info.next === null) return undefined;
  const url = new URL(lastPage.info.next);
  const page = url.searchParams.get('page');
  return page !== null ? Number(page) : undefined;
}

export function useInfiniteCharacters(
  filters: Omit<CharacterFilters, 'page'> = {},
): UseInfiniteQueryResult<InfiniteData<PaginatedResponse<Character>>, ApiError> {
  return useInfiniteQuery<PaginatedResponse<Character>, ApiError>({
    queryKey: ['characters', 'infinite', filters],
    queryFn: ({ pageParam }) =>
      CharacterService.getCharacters({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam,
  });
}
