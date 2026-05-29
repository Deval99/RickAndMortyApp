import { useCallback, useEffect } from 'react';
import { loadFavourites } from '../store';
import { useAppDispatch, useAppSelector } from '../store/hooks';

/**
 * Provides the list of favourited characters from the Redux store.
 * Triggers a SQLite load on mount (and on manual `reload()`).
 * Works fully offline — no API calls.
 */
export function useFavourites() {
  const dispatch = useAppDispatch();

  const characters = useAppSelector(state => state.favourites.characters);
  const isLoading = useAppSelector(
    state => state.favourites.status === 'loading',
  );

  const reload = useCallback(() => {
    dispatch(loadFavourites());
  }, [dispatch]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { characters, isLoading, reload };
}
