import {
  InputFields,
  ResourceArgs,
  ScrapedItem,
  ScrapedResponse,
} from "../../../types/types";

export function getFlashcardData(
  inputFields: InputFields
): Promise<ScrapedResponse[]> {
  // Return an empty list if no words are passed
  if (inputFields.words.trim() === "") {
    return new Promise((res) => res([]));
  }

  const selectedResources = inputFields.languageResources.filter(
    (resource) => resource.isSelected
  );
  const words = inputFields.words.split("\n");
  const wordPromises: Promise<ScrapedResponse>[] = words.map((word) => {
    return new Promise((res) => {
      const args: { [K in ResourceArgs]: string } = {
        word: word,
        targetLang: inputFields.targetLanguage,
        nativeLang: inputFields.nativeLanguage,
      };

      const resourcePromises: Promise<ScrapedResponse>[] =
        selectedResources.map((resource) => {
          return new Promise((res) => {
            const url =
              resource.route +
              resource.args.map((argName) => args[argName]).join("/");
            fetch(url)
              .then((res) => res.json())
              .then((data: ScrapedResponse) => {
                res(data);
              })
              .catch((err) => {
                res({ word: word, scrapedData: [] });
              });
          });
        });

      Promise.all(resourcePromises).then((responses: ScrapedResponse[]) => {
        const combinedScraped: ScrapedItem[] = ([] as ScrapedItem[]).concat(
          ...responses
            .filter((response) => response.scrapedData)
            .map((response) => response.scrapedData)
        );
        res({ word: word, scrapedData: combinedScraped } as ScrapedResponse);
      });
    });
  });

  return Promise.all(wordPromises);
}
