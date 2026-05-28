import { useCallback, useEffect, useState } from 'react';
import { DatabaseService } from '../database/DatabaseService';
import { toggleFavourite } from '../store';
import { useAppDispatch } from '../store/hooks';
import type { Character } from '../types/character';

/**
 * Manages the favourite state for a single character.
 * - Reads initial state from SQLite on mount.
 * - On toggle: updates SQLite (including full character cache) and dispatches to Redux.
 *
 * Pass the full `character` object so it can be persisted for offline use.
 * The `characterId`-only overload is kept for backwards compatibility (detail
 * screen passes the full object; other callers may only have the id).
 */
export function useFavourite(characterId: number, character?: Character) {
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
      // Persist full character data so the Favourites screen works offline
      if (character) {
        DatabaseService.saveCharacter(character);
      }
    } else {
      DatabaseService.removeFavourite(characterId);
      DatabaseService.deleteCharacter(characterId);
    }
    setIsFavourite(next);
    dispatch(toggleFavourite(characterId));
  }, [isFavourite, characterId, character, dispatch]);

  return { isFavourite, toggle };
}
