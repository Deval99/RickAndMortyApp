import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DatabaseService } from '../../database/DatabaseService';
import type { Character } from '../../types/character';

// ─── State ────────────────────────────────────────────────────────────────────

export interface FavouritesState {
  /** Full character objects loaded from SQLite */
  characters: Character[];
  /** Set of favourite IDs for O(1) lookup */
  ids: number[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FavouritesState = {
  characters: [],
  ids: [],
  status: 'idle',
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

/** Load all favourited characters from SQLite into Redux. */
export const loadFavourites = createAsyncThunk<Character[]>(
  'favourites/load',
  async () => {
    return DatabaseService.getFavouriteCharacters();
  },
);

/** Add a character to favourites — persists to SQLite then updates Redux. */
export const addFavourite = createAsyncThunk<Character, Character>(
  'favourites/add',
  async (character: Character) => {
    await DatabaseService.saveCharacter(character);
    await DatabaseService.addFavourite(character.id);
    return character;
  },
);

/** Remove a character from favourites — persists to SQLite then updates Redux. */
export const removeFavourite = createAsyncThunk<number, number>(
  'favourites/remove',
  async (id: number) => {
    await DatabaseService.removeFavourite(id);
    await DatabaseService.deleteCharacter(id);
    return id;
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // ── loadFavourites ──
    builder
      .addCase(loadFavourites.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadFavourites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.characters = action.payload;
        state.ids = action.payload.map(c => c.id);
      })
      .addCase(loadFavourites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load favourites';
      });

    // ── addFavourite ──
    builder
      .addCase(addFavourite.fulfilled, (state, action) => {
        const character = action.payload;
        if (!state.ids.includes(character.id)) {
          state.characters.push(character);
          state.ids.push(character.id);
        }
      });

    // ── removeFavourite ──
    builder
      .addCase(removeFavourite.fulfilled, (state, action) => {
        const id = action.payload;
        state.characters = state.characters.filter(c => c.id !== id);
        state.ids = state.ids.filter(existingId => existingId !== id);
      });
  },
});

export default favouritesSlice.reducer;
