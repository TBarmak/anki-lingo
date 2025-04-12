import { createSlice } from "@reduxjs/toolkit";
import type { CombinedScrapedResponse } from "../types/types";

const slice = createSlice({
  name: "root",
  initialState: {
    isLoading: false,
    scrapedData: [] as CombinedScrapedResponse[],
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setScrapedData: (state, action) => {
      state.scrapedData = action.payload;
    },
  },
});

export const { setIsLoading, setScrapedData } = slice.actions;
export default slice.reducer;
