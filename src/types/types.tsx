export interface InputFields {
  words: string;
  targetLanguage: string;
  nativeLanguage: string;
  languageResources: LanguageResource[];
}

export interface LanguageResource {
  name: string;
  route: string;
  healthRoute: string;
  args: ResourceArgs[];
  outputs: string[];
  supportedLanguages: string[];
  isSelected?: boolean;
  isHealthy?: boolean;
}

export enum ResourceArgs {
  word = "word",
  targetLang = "targetLang",
  nativeLang = "nativeLang",
}

export interface FormErrors {
  words?: string;
  targetLanguage?: string;
  nativeLanguage?: string;
  languageResources?: string;
}

export interface WordScrapeError {
  word: string;
  errors: string[];
}

export interface ScrapedResponse {
  inputWord: string;
  scrapedWordData: ScrapedItem[];
  url?: string;
  error?: string;
}

export interface CombinedScrapedResponse {
  inputWord: string;
  scrapedWordData: ScrapedItem[];
  urls?: string[];
  errors?: string[];
}

export interface ScrapedItem {
  pos?: string;
  word?: string;
  definition?: string;
  translations?: string[];
  nativeExampleSentences?: string[];
  targetExampleSentences?: string[];
  audioFilenames?: string[];
  expression?: string;
  expressionMeaning?: string;
}

export interface CardFormat {
  sides: CardSide[];
}

export interface CardSide {
  fields: string[];
}
