import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { EpisodeService } from '../services/EpisodeService';
import type { Episode } from '../types/episode';
import type { ApiError, PaginatedResponse } from '../types/api';
import { useNetworkStatus } from './useNetworkStatus';

export interface EpisodeSeason {
  season: number;
  title: string;
  data: Episode[];
}

/** Extracts season number from episode code like "S01E04" → 1 */
function parseSeason(episodeCode: string): number {
  const match = episodeCode.match(/^S(\d+)/i);
  return match ? parseInt(match[1] ?? '0', 10) : 0;
}

export function useAllEpisodes() {
  const { isOnline, isChecking } = useNetworkStatus();
  const canFetch = !isChecking && isOnline;

  const query = useInfiniteQuery<PaginatedResponse<Episode>, ApiError>({
    queryKey: ['episodes', 'all'],
    queryFn: ({ pageParam }) => EpisodeService.getEpisodesPage(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (!lastPage.info.next) return undefined;
      const url = new URL(lastPage.info.next);
      const page = url.searchParams.get('page');
      return page !== null ? Number(page) : undefined;
    },
    enabled: canFetch,
  });

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = query;

  useEffect(() => {
    if (canFetch && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [canFetch, hasNextPage, isFetchingNextPage, fetchNextPage]);

  /** All episodes flattened and grouped by season */
  const seasons: EpisodeSeason[] = useMemo(() => {
    const allEpisodes = data?.pages.flatMap(p => p.results) ?? [];
    const map = new Map<number, Episode[]>();

    for (const ep of allEpisodes) {
      const s = parseSeason(ep.episode);
      if (!map.has(s)) map.set(s, []);
      map.get(s)!.push(ep);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([season, episodes]) => ({
        season,
        title: `Season ${season}`,
        data: episodes,
      }));
  }, [data]);

  const totalLoaded = data?.pages.flatMap(p => p.results).length ?? 0;

  return {
    ...query,
    seasons,
    totalLoaded,
    isLoadingAll: query.isLoading || (canFetch && hasNextPage),
  };
}
