import { useCallback } from 'react';
import { addFavourite, removeFavourite } from '../store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Character } from '../types/character';

/**
 * Manages the favourite state for a single character.
 *
 * - Reads `isFavourite` from the Redux favourites slice (source of truth).
 * - On toggle: dispatches the appropriate thunk which persists to SQLite
 *   and updates Redux state atomically.
 *
 * Pass the full `character` object so it can be persisted for offline use.
 */
export function useFavourite(characterId: number, character?: Character) {
  const dispatch = useAppDispatch();

  const isFavourite = useAppSelector(state =>
    state.favourites.ids.includes(characterId),
  );

  const toggle = useCallback(() => {
    if (isFavourite) {
      dispatch(removeFavourite(characterId));
    } else if (character) {
      dispatch(addFavourite(character));
    }
  }, [isFavourite, characterId, character, dispatch]);

  return { isFavourite, toggle };
}
