import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoriteState {
  ids: string[];
}

const initialState: FavoriteState = {
  ids: [],
};

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    setFavorites(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
    },
    addFavorite(state, action: PayloadAction<string>) {
      if (!state.ids.includes(action.payload)) {
        state.ids.push(action.payload);
      }
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter(id => id !== action.payload);
    },
    toggleFavoriteLocal(state, action: PayloadAction<string>) {
      if (state.ids.includes(action.payload)) {
        state.ids = state.ids.filter(id => id !== action.payload);
      } else {
        state.ids.push(action.payload);
      }
    }
  },
});

export const { setFavorites, addFavorite, removeFavorite, toggleFavoriteLocal } = favoriteSlice.actions;
export default favoriteSlice.reducer;
