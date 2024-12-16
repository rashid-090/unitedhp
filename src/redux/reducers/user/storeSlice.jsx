// In your Redux slice (e.g., storeSlice.js)
import { createSlice } from '@reduxjs/toolkit';

const storeSlice = createSlice({
  name: 'stores',
  initialState: {
    stores: [],
    searchParams: {
      district: null,
      city: null
    },
    totalAvailableStores: null
  },
  reducers: {
    setStores: (state, action) => {
      state.stores = action.payload;
    },
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
    setTotalAvailableStores: (state, action) => {
      state.totalAvailableStores = action.payload;
    },
    clearStores: (state) => {
      state.stores = [];
      state.searchParams = { district: null, city: null };
      state.totalAvailableStores = null;
    }
  }
});

export const { 
  setStores, 
  setSearchParams, 
  setTotalAvailableStores, 
  clearStores 
} = storeSlice.actions;
export default storeSlice.reducer;