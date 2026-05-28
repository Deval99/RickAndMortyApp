import { useCallback, useEffect, useState } from 'react';
import { DatabaseService } from '../database/DatabaseService';
import type { Character } from '../types/character';

/**
 * Loads all favourited characters from SQLite.
 * No API calls — works fully offline.
 */
export function useFavourites() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await DatabaseService.getFavouriteCharacters();
      setCharacters(results);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { characters, isLoading, reload: load };
}
