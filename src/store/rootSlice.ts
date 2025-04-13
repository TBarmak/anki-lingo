import { createSlice } from "@reduxjs/toolkit";
import type { CardFormat, CombinedScrapedResponse } from "../types/types";

const slice = createSlice({
  name: "root",
  initialState: {
    isLoading: false,
    scrapedData: [] as CombinedScrapedResponse[],
    exportFields: [] as string[],
    cardFormat: {
      sides: [{ fields: ["inputWord"] }],
    } as CardFormat,
    downloadUrl: "",
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setScrapedData: (state, action) => {
      state.scrapedData = action.payload;
    },
    setExportFields: (state, action) => {
      state.exportFields = action.payload;
    },
    setDownloadUrl: (state, action) => {
      state.downloadUrl = action.payload;
    },
    setCardFormat: (state, action) => {
      state.cardFormat = action.payload;
    },
  },
});

export const {
  setIsLoading,
  setScrapedData,
  setExportFields,
  setDownloadUrl,
  setCardFormat,
} = slice.actions;
export default slice.reducer;
