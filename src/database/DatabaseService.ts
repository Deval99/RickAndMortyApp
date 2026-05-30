import { open, type QuickSQLiteConnection } from 'react-native-quick-sqlite';
import type { DatabaseError } from '../types/api';
import type { Character } from '../types/character';

let db: QuickSQLiteConnection | null = null;

function getDatabase(): QuickSQLiteConnection {
  if (db) return db;
  db = open({ name: 'app.db', location: 'default' });
  return db;
}

/** Maps a raw SQLite row to a typed {@link Character} object. */
function rowToCharacter(row: Record<string, unknown>): Character {
  return {
    id: row.id as number,
    name: row.name as string,
    status: row.status as Character['status'],
    species: row.species as string,
    type: row.type as string,
    gender: row.gender as Character['gender'],
    image: row.image as string,
    url: row.url as string,
    created: row.created as string,
    origin: { name: row.origin_name as string, url: row.origin_url as string },
    location: { name: row.location_name as string, url: row.location_url as string },
    episode: JSON.parse((row.episode as string) || '[]') as string[],
  };
}

export const DatabaseService = {
  initDatabase: async (): Promise<void> => {
    try {
      const database = getDatabase();

      // Full character cache table (used by the Favourites offline screen)
      database.execute(
        `CREATE TABLE IF NOT EXISTS characters (
        id            INTEGER PRIMARY KEY,
        name          TEXT    NOT NULL,
        status        TEXT    NOT NULL,
        species       TEXT    NOT NULL,
        type          TEXT    NOT NULL,
        gender        TEXT    NOT NULL,
        image         TEXT    NOT NULL,
        url           TEXT    NOT NULL,
        created       TEXT    NOT NULL,
        origin_name   TEXT    NOT NULL DEFAULT '',
        origin_url    TEXT    NOT NULL DEFAULT '',
        location_name TEXT    NOT NULL DEFAULT '',
        location_url  TEXT    NOT NULL DEFAULT '',
        episode       TEXT    NOT NULL DEFAULT '[]'
      )`,
      );

      // Migrate existing installs: add columns if they don't exist yet
      const migrations = [
        "ALTER TABLE characters ADD COLUMN origin_name   TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE characters ADD COLUMN origin_url    TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE characters ADD COLUMN location_name TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE characters ADD COLUMN location_url  TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE characters ADD COLUMN episode       TEXT NOT NULL DEFAULT '[]'",
      ];
      for (const sql of migrations) {
        try { database.execute(sql); } catch { /* column already exists */ }
      }

      // Favourites table — just stores IDs
      database.execute(
        `CREATE TABLE IF NOT EXISTS favourites (
        id INTEGER PRIMARY KEY
      )`,
      );
    } catch (error) {
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

  /** Upsert a full character row so it's available offline. */
  saveCharacter: async (character: Character): Promise<void> => {
    try {
      getDatabase().execute(
        `INSERT OR REPLACE INTO characters
          (id, name, status, species, type, gender, image, url, created,
           origin_name, origin_url, location_name, location_url, episode)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          character.id,
          character.name,
          character.status,
          character.species,
          character.type,
          character.gender,
          character.image,
          character.url,
          character.created,
          character.origin.name,
          character.origin.url,
          character.location.name,
          character.location.url,
          JSON.stringify(character.episode),
        ],
      );
    } catch (error) {
      const dbError: DatabaseError = {
        message: error instanceof Error ? error.message : 'Failed to save character',
        originalError: error,
      };
      throw dbError;
    }
  },

  /** Remove a character row from the cache. */
  deleteCharacter: async (id: number): Promise<void> => {
    try {
      getDatabase().execute('DELETE FROM characters WHERE id = ?', [id]);
    } catch (error) {
      const dbError: DatabaseError = {
        message: error instanceof Error ? error.message : 'Failed to delete character',
        originalError: error,
      };
      throw dbError;
    }
  },

  /** Return a single cached character by ID, or `null` if not in the cache. */
  getCharacterById: async (id: number): Promise<Character | null> => {
    try {
      const result = getDatabase().execute(
        'SELECT * FROM characters WHERE id = ? LIMIT 1',
        [id],
      );
      const row = result.rows?._array?.[0] as Record<string, unknown> | undefined;
      return row ? rowToCharacter(row) : null;
    } catch {
      return null;
    }
  },

  /** Return all characters that are currently in the favourites table. */
  getFavouriteCharacters: async (): Promise<Character[]> => {
    try {
      const result = getDatabase().execute(
        `SELECT c.* FROM characters c
         INNER JOIN favourites f ON c.id = f.id
         ORDER BY c.name ASC`,
      );
      return (result.rows?._array ?? []).map(
        (row: Record<string, unknown>) => rowToCharacter(row),
      );
    } catch {
      return [];
    }
  },

  addFavourite: async (id: number): Promise<void> => {
    try {
      getDatabase().execute('INSERT OR IGNORE INTO favourites (id) VALUES (?)', [id]);
    } catch (error) {
      throw { message: error instanceof Error ? error.message : 'Failed to add favourite', originalError: error } as DatabaseError;
    }
  },

  removeFavourite: async (id: number): Promise<void> => {
    try {
      getDatabase().execute('DELETE FROM favourites WHERE id = ?', [id]);
    } catch (error) {
      throw { message: error instanceof Error ? error.message : 'Failed to remove favourite', originalError: error } as DatabaseError;
    }
  },

  isFavourite: async (id: number): Promise<boolean> => {
    try {
      const result = getDatabase().execute('SELECT id FROM favourites WHERE id = ? LIMIT 1', [id]);
      return (result.rows?._array?.length ?? 0) > 0;
    } catch {
      return false;
    }
  },

  getAllFavouriteIds: async (): Promise<number[]> => {
    try {
      const result = getDatabase().execute('SELECT id FROM favourites');
      return (result.rows?._array ?? []).map((row: { id: number }) => row.id);
    } catch {
      return [];
    }
  },
};
