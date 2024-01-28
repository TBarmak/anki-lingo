export interface InputFields {
  words: string;
  targetLanguage: string;
  nativeLanguage: string;
  languageResources: LanguageResource[];
  exportFields: ExportField[];
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

export interface ExportField {
  name: string;
  isSelected?: boolean;
}

export interface FormErrors {
  words: string;
  targetLanguage: string;
  nativeLanguage: string;
  languageResources: string;
  exportFields: string;
}

export interface ScrapedResponse {
  word: string;
  scrapedData: ScrapedItem[];
}

export interface ScrapedItem {
  pos: string;
  word: string;
  definition: string;
  translations: string[];
  nativeExampleSentences: string[];
  targetExampleSentences: string[];
}
