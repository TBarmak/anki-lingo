import {
  CombinedScrapedResponse,
  InputFields,
  ResourceArgs,
  ScrapedItem,
  ScrapedResponse,
} from "../../../types/types";

export function getFlashcardData(
  inputFields: InputFields
): Promise<CombinedScrapedResponse[]> {
  // Return an empty list if no words are passed
  if (inputFields.words.trim() === "") {
    return new Promise((res) => res([]));
  }

  const selectedResources = inputFields.languageResources.filter(
    (resource) => resource.isSelected
  );
  const words = inputFields.words.split("\n");
  const wordPromises: Promise<CombinedScrapedResponse>[] = words.map((word) => {
    return new Promise((res) => {
      const args: { [K in ResourceArgs]: string } = {
        word: word,
        targetLang: inputFields.targetLanguage,
        nativeLang: inputFields.nativeLanguage,
      };

      const resourcePromises: Promise<ScrapedResponse>[] =
        selectedResources.map((resource): Promise<ScrapedResponse> => {
          return new Promise((res) => {
            const url =
              resource.route +
              resource.args.map((argName) => args[argName]).join("/");
            fetch(url)
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
              })
              .then((data: ScrapedResponse) => {
                res(data);
              })
              .catch(() => {
                res({
                  inputWord: word,
                  scrapedWordData: [],
                  url: "",
                  error: resource.name,
                });
              });
          });
        });

      Promise.all(resourcePromises).then((responses: ScrapedResponse[]) => {
        const combinedScrapedData: ScrapedItem[] = ([] as ScrapedItem[]).concat(
          ...responses
            .filter((response) => response.scrapedWordData.length)
            .map((response) => response.scrapedWordData)
        );
        res({
          inputWord: word,
          scrapedWordData: combinedScrapedData,
          urls: responses
            .filter((res) => res.url)
            .map((res) => res.url as string),
          errors: responses
            .filter((res) => res.error)
            .map((res) => res.error as string),
        });
      });
    });
  });

  return Promise.all(wordPromises);
}
