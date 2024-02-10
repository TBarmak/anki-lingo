import { describe, it, expect, beforeEach } from "vitest";
import { InputFields } from "../../../../types/types";
import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";
import { getFlashcardData } from "../getFlashcardData";
import {
  abacaxiMichaelisResponse,
  abacaxiMultiResourceInput,
  abacaxiNoResourcesInput,
  abacaxiWordReferenceInput,
  abacaxiWordReferenceResponse,
  homemMichaelisResponse,
  homemWordReferenceResponse,
  multiWordMichaelisInput,
  multiWordMultiResourceInput,
  noWordsInput,
} from "./mocks";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

describe("getFlashcardData.ts", () => {
  beforeEach(() => {
    fetchMocker.resetMocks();
  });

  describe("When no words are provided", () => {
    it("Then returns an empty list", async () => {
      // Arrange
      const inputFields: InputFields = noWordsInput;
      // Act
      const data = await getFlashcardData(inputFields);
      // Assert
      expect(data.length).toEqual(0);
    });
  });

  describe("When one word is provided", () => {
    describe("When no resources are selected", () => {
      it("Then returns an empty list for scrapedData", async () => {
        // Arrange
        const inputFields: InputFields = abacaxiNoResourcesInput;
        // Act
        const data = await getFlashcardData(inputFields);
        // Assert
        expect(data.length).toEqual(1);
        expect(data[0].word).toEqual(abacaxiNoResourcesInput.words);
        expect(data[0].scrapedData.length).toEqual(0);
      });
    });

    describe("When one resource is selected", () => {
      describe("When the word is scraped successfully", () => {
        it("Then returns the scraped data for that word", async () => {
          // Arrange
          const inputFields: InputFields = abacaxiWordReferenceInput;
          fetchMocker.mockResponse(
            JSON.stringify(abacaxiWordReferenceResponse)
          );
          // Act
          const data = await getFlashcardData(inputFields);
          // Assert
          expect(data.length).toEqual(1);
          expect(data[0].word).toEqual(abacaxiWordReferenceInput.words);
          expect(data[0].scrapedData).toEqual(
            abacaxiWordReferenceResponse.scrapedData
          );
        });
      });

      describe("When the word is not scraped successfully", () => {
        it("Then returns an empty list for scraped data", async () => {
          // Arrange
          const inputFields: InputFields = abacaxiWordReferenceInput;
          fetchMocker.mockReject();
          // Act
          const data = await getFlashcardData(inputFields);
          // Assert
          expect(data.length).toEqual(1);
          expect(data[0].word).toEqual(abacaxiWordReferenceInput.words);
          expect(data[0].scrapedData.length).toEqual(0);
        });
      });
    });

    describe("When multiple resources are selected", () => {
      describe("When all resources are scraped successfully", () => {
        it("Then returns the scraped data for that word from all the resources", async () => {
          // Arrange
          const inputFields: InputFields = abacaxiMultiResourceInput;
          fetchMocker.mockResponseOnce(
            JSON.stringify(abacaxiWordReferenceResponse)
          );
          fetchMocker.mockResponseOnce(
            JSON.stringify(abacaxiMichaelisResponse)
          );
          // Act
          const data = await getFlashcardData(inputFields);
          // Assert
          expect(data.length).toEqual(1);
          expect(data[0].word).toEqual(abacaxiMultiResourceInput.words);
          expect(data[0].scrapedData.length).toEqual(
            abacaxiMichaelisResponse.scrapedData.length +
              abacaxiWordReferenceResponse.scrapedData.length
          );
        });
      });

      describe("When some of the resources are not scraped successfully", () => {
        it("Then returns the scraped data for that word for the successful resource(s)", async () => {
          // Arrange
          const inputFields: InputFields = abacaxiMultiResourceInput;
          fetchMocker.mockRejectOnce();
          fetchMocker.mockResponseOnce(
            JSON.stringify(abacaxiMichaelisResponse)
          );
          // Act
          const data = await getFlashcardData(inputFields);
          // Assert
          expect(data.length).toEqual(1);
          expect(data[0].word).toEqual(abacaxiMultiResourceInput.words);
          expect(data[0].scrapedData.length).toEqual(
            abacaxiMichaelisResponse.scrapedData.length
          );
        });
      });
    });
  });

  describe("When multiple words are provided", () => {
    describe("When one resource is selected", () => {
      it("Then fetches all the words from the resource", async () => {
        // Arrange
        const inputFields: InputFields = multiWordMichaelisInput;
        fetchMocker.mockResponseOnce(JSON.stringify(abacaxiMichaelisResponse));
        fetchMocker.mockResponseOnce(JSON.stringify(homemMichaelisResponse));
        // Act
        const data = await getFlashcardData(inputFields);
        // Assert
        expect(data.length).toEqual(2);
        expect(data[0].word).toEqual(
          multiWordMichaelisInput.words.split("\n")[0]
        );
        expect(data[0].scrapedData).toEqual(
          abacaxiMichaelisResponse.scrapedData
        );
        expect(data[1].word).toEqual(
          multiWordMichaelisInput.words.split("\n")[1]
        );
        expect(data[1].scrapedData).toEqual(homemMichaelisResponse.scrapedData);
      });
    });

    describe("When multiple resources are selected", () => {
      it("Then fetches all the words from all the resources", async () => {
        // Arrange
        const inputFields: InputFields = multiWordMultiResourceInput;
        fetchMocker.mockResponse((req: Request) => {
          const url = req.url;
          if (url.includes("wr")) {
            if (url.includes("abacaxi")) {
              return JSON.stringify(abacaxiWordReferenceResponse);
            } else if (url.includes("homem")) {
              return JSON.stringify(homemWordReferenceResponse);
            }
          } else if (url.includes("michaelis")) {
            if (url.includes("abacaxi")) {
              return JSON.stringify(abacaxiMichaelisResponse);
            } else if (url.includes("homem")) {
              return JSON.stringify(homemMichaelisResponse);
            }
          }
          return "";
        });
        // Act
        const data = await getFlashcardData(inputFields);
        // Assert
        expect(data.length).toEqual(2);
        expect(data[0].word).toEqual("abacaxi");
        expect(data[1].word).toEqual("homem");
        expect(data[0].scrapedData).toEqual(
          abacaxiWordReferenceResponse.scrapedData.concat(
            abacaxiMichaelisResponse.scrapedData
          )
        );
        expect(data[1].scrapedData).toEqual(
          homemWordReferenceResponse.scrapedData.concat(
            homemMichaelisResponse.scrapedData
          )
        );
      });
    });
  });
});
