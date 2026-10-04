import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from ".";

export const selectExportFields = createSelector(
  (state: RootState) => state.resourceForm.languageResources,
  (languageResources) => [
    ...new Set(
      languageResources
        .filter((resource) => resource.isSelected)
        .flatMap((resource) => resource.outputs)
    ),
  ]
);
