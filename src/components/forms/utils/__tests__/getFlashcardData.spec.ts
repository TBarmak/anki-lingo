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
        expect(data[0].inputWord).toEqual(abacaxiNoResourcesInput.words);
        expect(data[0].scrapedWordData.length).toEqual(0);
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
          expect(data[0].inputWord).toEqual(abacaxiWordReferenceInput.words);
          expect(data[0].scrapedWordData).toEqual(
            abacaxiWordReferenceResponse.scrapedWordData
          );
          expect(data[0].urls).toEqual([abacaxiWordReferenceResponse.url]);
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
          expect(data[0].inputWord).toEqual(abacaxiWordReferenceInput.words);
          expect(data[0].scrapedWordData.length).toEqual(0);
          expect(data[0].urls).toEqual([]);
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
          expect(data[0].inputWord).toEqual(abacaxiMultiResourceInput.words);
          expect(data[0].scrapedWordData.length).toEqual(
            abacaxiMichaelisResponse.scrapedWordData.length +
              abacaxiWordReferenceResponse.scrapedWordData.length
          );
          expect(data[0].urls).toEqual([
            abacaxiWordReferenceResponse.url,
            abacaxiMichaelisResponse.url,
          ]);
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
          expect(data[0].inputWord).toEqual(abacaxiMultiResourceInput.words);
          expect(data[0].scrapedWordData.length).toEqual(
            abacaxiMichaelisResponse.scrapedWordData.length
          );
          expect(data[0].urls).toEqual([abacaxiMichaelisResponse.url]);
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
        expect(data[0].inputWord).toEqual(
          multiWordMichaelisInput.words.split("\n")[0]
        );
        expect(data[0].scrapedWordData).toEqual(
          abacaxiMichaelisResponse.scrapedWordData
        );
        expect(data[0].urls).toEqual([abacaxiMichaelisResponse.url]);
        expect(data[1].inputWord).toEqual(
          multiWordMichaelisInput.words.split("\n")[1]
        );
        expect(data[1].scrapedWordData).toEqual(
          homemMichaelisResponse.scrapedWordData
        );
        expect(data[1].urls).toEqual([homemMichaelisResponse.url]);
      });
    });

    describe("When multiple resources are selected", () => {
      it("Then fetches all the words from all of the resources", async () => {
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
        expect(data[0].inputWord).toEqual("abacaxi");
        expect(data[1].inputWord).toEqual("homem");
        expect(data[0].scrapedWordData).toEqual(
          abacaxiWordReferenceResponse.scrapedWordData.concat(
            abacaxiMichaelisResponse.scrapedWordData
          )
        );
        expect(data[0].urls).toEqual([
          abacaxiWordReferenceResponse.url,
          abacaxiMichaelisResponse.url,
        ]);
        expect(data[1].scrapedWordData).toEqual(
          homemWordReferenceResponse.scrapedWordData.concat(
            homemMichaelisResponse.scrapedWordData
          )
        );
        expect(data[1].urls).toEqual([
          homemWordReferenceResponse.url,
          homemMichaelisResponse.url,
        ]);
      });
    });
  });
});
