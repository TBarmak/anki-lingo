import { createSlice } from "@reduxjs/toolkit";
import type { CombinedScrapedResponse } from "../types/types";

const slice = createSlice({
  name: "root",
  initialState: {
    isLoading: false,
    wordProgress: { current: 0, total: 0 },
    scrapedData: [] as CombinedScrapedResponse[],
    exportFields: [] as string[],
    cardFormat: {
      sides: [{ fields: ["inputWord"] }],
    },
    downloadUrl: "",
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setWordProgress: (state, action) => {
      state.wordProgress = action.payload;
    },
    setScrapedData: (state, action) => {
      state.scrapedData = action.payload;
    },
    setExportFields: (state, action) => {
      state.exportFields = action.payload;
    },
    setCardFormat: (state, action) => {
      state.cardFormat = action.payload;
    },
    setDownloadUrl: (state, action) => {
      state.downloadUrl = action.payload;
    },
  },
});

export const {
  setIsLoading,
  setWordProgress,
  setScrapedData,
  setExportFields,
  setCardFormat,
  setDownloadUrl,
} = slice.actions;
export default slice.reducer;
