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
    } catch (error) {
      const dbError: DatabaseError = {
        message: error instanceof Error ? error.message : 'Failed to initialise database',
        originalError: error,
      };
      throw dbError;
    }
  },
};
