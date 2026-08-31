import {
  CombinedScrapedResponse,
  InputFields,
  ResourceArgs,
  ScrapedItem,
  ScrapedResponse,
} from "../../../types/types";

export function getFlashcardData(
  inputFields: InputFields,
  onWordDone?: () => void
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
            // No client-side timeout: scrapers enforce their own 20s server-side
            // timeout, and the browser caps connections per host (~6). A client
            // AbortSignal.timeout starts counting at creation, so queued requests
            // would all abort at once once the batch is large.
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
        onWordDone?.();
      });
    });
  });

  return Promise.all(wordPromises);
}
