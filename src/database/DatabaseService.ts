import { open, type QuickSQLiteConnection } from 'react-native-quick-sqlite';
import type { DatabaseError } from '../types/api';

let db: QuickSQLiteConnection | null = null;

function getDatabase(): QuickSQLiteConnection {
  if (db) return db;
  db = open({ name: 'app.db', location: 'default' });
  return db;
}

export const DatabaseService = {
  initDatabase: async (): Promise<void> => {
    try {
      const database = getDatabase();

      database.execute(
        `CREATE TABLE IF NOT EXISTS characters (
        id      INTEGER PRIMARY KEY,
        name    TEXT    NOT NULL,
        status  TEXT    NOT NULL,
        species TEXT    NOT NULL,
        type    TEXT    NOT NULL,
        gender  TEXT    NOT NULL,
        image   TEXT    NOT NULL,
        url     TEXT    NOT NULL,
        created TEXT    NOT NULL
      )`,
      );

      // Favourites table
      database.execute(
        `CREATE TABLE IF NOT EXISTS favourites (
        id INTEGER PRIMARY KEY
      )`,
      );
    } catch (error) {
      console.log("SDLKNFLKSNDFKJSDNFK ", error);
      
      const dbError: DatabaseError = {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to initialise database',
        originalError: error,
      };

      throw dbError;
    }
  },

  addFavourite: async (id: number): Promise<void> => {
    try {
      getDatabase().execute(
        'INSERT OR IGNORE INTO favourites (id) VALUES (?)',
        [id],
      );
    } catch (error) {
      const dbError: DatabaseError = {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to add favourite',
        originalError: error,
      };

      throw dbError;
    }
  },

  removeFavourite: async (id: number): Promise<void> => {
    try {
      getDatabase().execute(
        'DELETE FROM favourites WHERE id = ?',
        [id],
      );
    } catch (error) {
      const dbError: DatabaseError = {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to remove favourite',
        originalError: error,
      };

      throw dbError;
    }
  },

  isFavourite: async (id: number): Promise<boolean> => {
    try {
      const result = getDatabase().execute(
        'SELECT id FROM favourites WHERE id = ? LIMIT 1',
        [id],
      );

      return (result.rows?._array?.length ?? 0) > 0;
    } catch {
      return false;
    }
  },

  getAllFavouriteIds: async (): Promise<number[]> => {
    try {
      const result = getDatabase().execute(
        'SELECT id FROM favourites',
      );

      return (result.rows?._array ?? []).map(
        (row: { id: number }) => row.id,
      );
    } catch {
      return [];
    }
  },
};
