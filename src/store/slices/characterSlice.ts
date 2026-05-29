import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Character } from '../../types/character';

export interface CharacterState {
  favourites: number[];
  selectedCharacter: Character | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CharacterState = {
  favourites: [],
  selectedCharacter: null,
  status: 'idle',
  error: null,
};

export const fetchCharacterById = createAsyncThunk<Character, number>(
  'characters/fetchById',
  async (id: number) => {
    const { CharacterService } = await import('../../services/CharacterService');
    return CharacterService.getCharacterById(id);
  },
);

const characterSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    toggleFavourite(state, action: PayloadAction<number>) {
      const id = action.payload;
      const index = state.favourites.indexOf(id);
      if (index === -1) {
        state.favourites.push(id);
      } else {
        state.favourites.splice(index, 1);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCharacterById.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCharacterById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedCharacter = action.payload;
      })
      .addCase(fetchCharacterById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const { toggleFavourite } = characterSlice.actions;
export default characterSlice.reducer;
