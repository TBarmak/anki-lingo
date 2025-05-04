import type { Dispatch } from "redux";
import {
  setTargetLanguage,
  setNativeLanguage,
  setWords,
  setLanguageResources,
} from "../../../store/resourceFormSlice";
import {
  setScrapedData,
  setExportFields,
  setCardFormat,
  setDownloadUrl,
  setIsLoading,
} from "../../../store/rootSlice";

export function resetFormState(dispatch: Dispatch) {
  dispatch(setTargetLanguage(""));
  dispatch(setNativeLanguage(""));
  dispatch(setWords(""));
  dispatch(setLanguageResources([]));
  dispatch(setScrapedData([]));
  dispatch(setExportFields([]));
  dispatch(setCardFormat({ sides: [{ fields: ["inputWord"] }] }));
  dispatch(setDownloadUrl(""));
  dispatch(setIsLoading(false));
}
