import { describe, it, expect, vi } from "vitest";
import { resetFormState } from "../resetFormState";

describe("resetFormState.ts", () => {
  it("Then dispatches reset actions for all fields", () => {
    // Arrange
    const mockDispatch = vi.fn();
    // Act
    resetFormState(mockDispatch);
    // Assert
    expect(mockDispatch).toHaveBeenCalledTimes(9);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "resourceForm/setTargetLanguage",
      payload: "",
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "resourceForm/setNativeLanguage",
      payload: "",
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "resourceForm/setWords",
      payload: "",
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "resourceForm/setLanguageResources",
      payload: [],
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "root/setScrapedData",
      payload: [],
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "root/setExportFields",
      payload: [],
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "root/setCardFormat",
      payload: { sides: [{ fields: ["inputWord"] }] },
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "root/setDownloadUrl",
      payload: "",
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "root/setIsLoading",
      payload: false,
    });
  });
});
