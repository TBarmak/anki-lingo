export interface InputFields {
  words: string;
  targetLanguage: string;
  nativeLanguage: string;
  languageResources: LanguageResource[];
}

export interface LanguageResource {
  name: string;
  route: string;
  args: ResourceArgs[];
  outputs: string[];
  supportedLanguages: string[];
  isSelected?: boolean;
}

export enum ResourceArgs {
  word = "word",
  targetLang = "targetLang",
  nativeLang = "nativeLang",
}

export interface FormErrors {
  words: string;
  targetLanguage: string;
  nativeLanguage: string;
  languageResources: string;
}

export interface ScrapedResponse {
  inputWord: string;
  scrapedWordData: ScrapedItem[];
}

export interface ScrapedItem {
  pos?: string;
  word: string;
  definition: string;
  translations?: string[];
  nativeExampleSentences?: string[];
  targetExampleSentences?: string[];
  audioFilenames?: string[];
}

export interface CardFormat {
  sides: CardSide[];
}

export interface CardSide {
  fields: string[];
  useWhitespace?: boolean;
}
