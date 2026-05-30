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

export { useAppDispatch, useAppSelector } from './hooks';

export { fetchCharacterById } from './slices/characterSlice';

export { loadFavourites, addFavourite, removeFavourite } from './slices/favouritesSlice';

export {
  setActiveTab,
  setSearchFilter,
  setStatusFilter,
  setGenderFilter,
  resetCharacterFilters,
} from './slices/uiSlice';
