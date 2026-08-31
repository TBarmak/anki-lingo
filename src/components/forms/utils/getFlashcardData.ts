import {
  CombinedScrapedResponse,
  InputFields,
  ResourceArgs,
  ScrapedItem,
  ScrapedResponse,
} from "../../../types/types";

const SCRAPE_TIMEOUT_MS = 25000;
// Browsers cap concurrent connections per host (~6 in Chrome). Keep dispatch at
// or below that so a request's timeout clock starts when it is actually sent,
// not while it sits queued behind earlier requests.
const MAX_CONCURRENT_REQUESTS = 6;

/**
 * Returns a function that runs at most `max` tasks at once; extra tasks wait
 * their turn. A task only runs once dispatched, so any timers it sets up start
 * then rather than while queued.
 */
function createLimiter(max: number) {
  let active = 0;
  const queue: Array<() => void> = [];
  return function run<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const start = () => {
        active += 1;
        task()
          .then(resolve, reject)
          .finally(() => {
            active -= 1;
            queue.shift()?.();
          });
      };
      if (active < max) {
        start();
      } else {
        queue.push(start);
      }
    });
  };
}

export function getFlashcardData(
  inputFields: InputFields,
  onWordDone?: () => void
): Promise<CombinedScrapedResponse[]> {
  // Return an empty list if no words are passed
  if (inputFields.words.trim() === "") {
    return Promise.resolve([]);
  }

  const selectedResources = inputFields.languageResources.filter(
    (resource) => resource.isSelected
  );
  const words = inputFields.words.split("\n");
  const limit = createLimiter(MAX_CONCURRENT_REQUESTS);

  const wordPromises = words.map((word) => {
    const args: { [K in ResourceArgs]: string } = {
      word: word,
      targetLang: inputFields.targetLanguage,
      nativeLang: inputFields.nativeLanguage,
    };

    const resourcePromises = selectedResources.map(
      (resource): Promise<ScrapedResponse> => {
        const url =
          resource.route +
          resource.args.map((argName) => args[argName]).join("/");
        // The fetch (and its timeout signal) is built inside the limiter, so it
        // is only created once this request is actually dispatched.
        return limit(() =>
          fetch(url, { signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS) }).then(
            (res) => {
              if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
              }
              return res.json() as Promise<ScrapedResponse>;
            }
          )
        ).catch(() => ({
          inputWord: word,
          scrapedWordData: [],
          url: "",
          error: resource.name,
        }));
      }
    );

    return Promise.all(resourcePromises).then((responses) => {
      const combinedScrapedData: ScrapedItem[] = ([] as ScrapedItem[]).concat(
        ...responses
          .filter((response) => response.scrapedWordData.length)
          .map((response) => response.scrapedWordData)
      );
      onWordDone?.();
      return {
        inputWord: word,
        scrapedWordData: combinedScrapedData,
        urls: responses
          .filter((res) => res.url)
          .map((res) => res.url as string),
        errors: responses
          .filter((res) => res.error)
          .map((res) => res.error as string),
      };
    });
  });

  return Promise.all(wordPromises);
}
