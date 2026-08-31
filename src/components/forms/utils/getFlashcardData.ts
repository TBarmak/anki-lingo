import {
  CombinedScrapedResponse,
  InputFields,
  ResourceArgs,
  ScrapedItem,
  ScrapedResponse,
} from "../../../types/types";

const SCRAPE_TIMEOUT_MS = 25000;
// Browsers cap concurrent connections per host (~6 in Chrome). Keep the pool at
// or below that so a request's timeout clock starts when it is actually
// dispatched, not while it sits queued behind earlier requests.
const MAX_CONCURRENT_REQUESTS = 6;

interface ScrapeTask {
  wordIndex: number;
  resourceName: string;
  url: string;
}

/**
 * Run `fn` over `items` with at most `limit` in flight at once. Results are
 * returned in input order regardless of completion order.
 */
async function pooledMap<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker(): Promise<void> {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  }

  const workerCount = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workerCount }, worker));
  return results;
}

export async function getFlashcardData(
  inputFields: InputFields,
  onWordDone?: () => void
): Promise<CombinedScrapedResponse[]> {
  // Return an empty list if no words are passed
  if (inputFields.words.trim() === "") {
    return [];
  }

  const selectedResources = inputFields.languageResources.filter(
    (resource) => resource.isSelected
  );
  const words = inputFields.words.split("\n");

  // Flatten every (word × resource) pair into a single task list so the pool
  // controls how many are dispatched at once. The timeout signal for each task
  // is created inside `fn`, right before the fetch, so its clock only starts
  // once the request is actually sent.
  const tasks: ScrapeTask[] = words.flatMap((word, wordIndex) =>
    selectedResources.map((resource) => {
      const args: { [K in ResourceArgs]: string } = {
        word: word,
        targetLang: inputFields.targetLanguage,
        nativeLang: inputFields.nativeLanguage,
      };
      return {
        wordIndex,
        resourceName: resource.name,
        url:
          resource.route +
          resource.args.map((argName) => args[argName]).join("/"),
      };
    })
  );

  // Track outstanding tasks per word so `onWordDone` fires once, incrementally,
  // as each word finishes — not all at the end — keeping the progress bar live.
  const remainingByWord = words.map(
    (_, wordIndex) =>
      tasks.filter((task) => task.wordIndex === wordIndex).length
  );
  // Words with no selected resources have no tasks; report them done up front.
  remainingByWord.forEach((remaining) => {
    if (remaining === 0) onWordDone?.();
  });

  const responses = await pooledMap(
    tasks,
    MAX_CONCURRENT_REQUESTS,
    async (task): Promise<ScrapedResponse> => {
      try {
        const res = await fetch(task.url, {
          signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS),
        });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return (await res.json()) as ScrapedResponse;
      } catch {
        return {
          inputWord: words[task.wordIndex],
          scrapedWordData: [],
          url: "",
          error: task.resourceName,
        };
      } finally {
        remainingByWord[task.wordIndex] -= 1;
        if (remainingByWord[task.wordIndex] === 0) onWordDone?.();
      }
    }
  );

  // Regroup per-resource responses back under their word, preserving the
  // original word order and per-word resource order.
  return words.map((word, wordIndex): CombinedScrapedResponse => {
    const wordResponses = tasks
      .map((task, taskIndex) =>
        task.wordIndex === wordIndex ? responses[taskIndex] : null
      )
      .filter((response): response is ScrapedResponse => response !== null);

    const combinedScrapedData: ScrapedItem[] = ([] as ScrapedItem[]).concat(
      ...wordResponses
        .filter((response) => response.scrapedWordData.length)
        .map((response) => response.scrapedWordData)
    );

    return {
      inputWord: word,
      scrapedWordData: combinedScrapedData,
      urls: wordResponses
        .filter((res) => res.url)
        .map((res) => res.url as string),
      errors: wordResponses
        .filter((res) => res.error)
        .map((res) => res.error as string),
    };
  });
}
