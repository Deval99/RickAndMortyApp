import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import favouritesReducer from './slices/favouritesSlice';

export const store = configureStore({
  reducer: {
    characters: characterReducer,
    favourites: favouritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Re-export character slice actions
export { toggleFavourite, fetchCharacterById } from './slices/characterSlice';

// Re-export favourites slice thunks
export { loadFavourites, addFavourite, removeFavourite } from './slices/favouritesSlice';
