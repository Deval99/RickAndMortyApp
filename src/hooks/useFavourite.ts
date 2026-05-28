import { useCallback, useEffect, useState } from 'react';
import { DatabaseService } from '../database/DatabaseService';
import { toggleFavourite } from '../store';
import { useAppDispatch } from '../store/hooks';

/**
 * Manages the favourite state for a single character.
 * - Reads initial state from SQLite on mount.
 * - On toggle: updates SQLite synchronously and dispatches to Redux.
 */
export function useFavourite(characterId: number) {
  const dispatch = useAppDispatch();
  const [isFavourite, setIsFavourite] = useState<boolean>(false);

  // Hydrate from SQLite on mount
  useEffect(() => {
    DatabaseService.isFavourite(characterId).then(setIsFavourite);
  }, [characterId]);

  const toggle = useCallback(() => {
    const next = !isFavourite;
    if (next) {
      DatabaseService.addFavourite(characterId);
    } else {
      DatabaseService.removeFavourite(characterId);
    }
    setIsFavourite(next);
    dispatch(toggleFavourite(characterId));
  }, [isFavourite, characterId, dispatch]);

  return { isFavourite, toggle };
}
