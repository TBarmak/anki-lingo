import { createSlice } from "@reduxjs/toolkit";
import type { InputFields } from "../types/types";
const resourceFormSlice = createSlice({
  name: "resourceForm",
  initialState: {
    words: "",
    targetLanguage: "",
    nativeLanguage: "",
    languageResources: [],
  } as InputFields,
  reducers: {
    setTargetLanguage: (state, action) => {
      state.targetLanguage = action.payload;
    },
    setNativeLanguage: (state, action) => {
      state.nativeLanguage = action.payload;
    },
    setWords: (state, action) => {
      state.words = action.payload;
    },
    setLanguageResources: (state, action) => {
      state.languageResources = action.payload;
    },
  },
});

export const {
  setTargetLanguage,
  setNativeLanguage,
  setWords,
  setLanguageResources,
} = resourceFormSlice.actions;
export default resourceFormSlice.reducer;
