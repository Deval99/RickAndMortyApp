import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TabParamList } from '../../navigation/AppNavigator';

/** Display-cased values that the FilterBar works with (empty string = no filter). */
export type DisplayStatus = 'Alive' | 'Dead' | 'unknown' | '';
export type DisplayGender = 'Female' | 'Male' | 'Genderless' | 'unknown' | '';

export interface CharacterFilterState {
  search: string;
  status: DisplayStatus;
  gender: DisplayGender;
}

export interface UIState {
  /** Active bottom-tab name, kept in sync with React Navigation. */
  activeTab: keyof TabParamList;
  /** Character list filter values (search text + status + gender). */
  characterFilters: CharacterFilterState;
}

const initialState: UIState = {
  activeTab: 'CharacterList',
  characterFilters: {
    search: '',
    status: '',
    gender: '',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<keyof TabParamList>) {
      state.activeTab = action.payload;
    },
    setSearchFilter(state, action: PayloadAction<string>) {
      state.characterFilters.search = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<DisplayStatus>) {
      state.characterFilters.status = action.payload;
    },
    setGenderFilter(state, action: PayloadAction<DisplayGender>) {
      state.characterFilters.gender = action.payload;
    },
    resetCharacterFilters(state) {
      state.characterFilters = initialState.characterFilters;
    },
  },
});

export const {
  setActiveTab,
  setSearchFilter,
  setStatusFilter,
  setGenderFilter,
  resetCharacterFilters,
} = uiSlice.actions;

export default uiSlice.reducer;
