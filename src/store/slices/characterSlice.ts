import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Character } from '../../types/character';

export interface CharacterState {
  selectedCharacter: Character | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CharacterState = {
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
  reducers: {},
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

export default characterSlice.reducer;
