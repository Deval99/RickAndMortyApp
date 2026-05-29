import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';

export const store = configureStore({
  reducer: {
    characters: characterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Re-export slice actions
export { toggleFavourite, fetchCharacterById } from './slices/characterSlice';
