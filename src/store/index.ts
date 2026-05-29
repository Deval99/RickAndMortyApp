import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import favouritesReducer from './slices/favouritesSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    characters: characterReducer,
    favourites: favouritesReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Re-export character slice actions
export { fetchCharacterById } from './slices/characterSlice';

// Re-export favourites slice thunks
export { loadFavourites, addFavourite, removeFavourite } from './slices/favouritesSlice';

// Re-export ui slice actions
export {
  setActiveTab,
  setSearchFilter,
  setStatusFilter,
  setGenderFilter,
  resetCharacterFilters,
} from './slices/uiSlice';
