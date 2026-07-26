import { LanguageResource } from "../../../../types/types";

export const wordReferenceResource: LanguageResource = {
  args: ["targetLang", "nativeLang", "word"],
  name: "Word Reference",
  outputs: ["word", "pos", "definition", "translations"],
  route: "api/wr/",
  healthRoute: "api/wr/français/english/vérifier",
  supportedLanguages: ["english", "español", "português", "français"],
} as LanguageResource;

export const michaelisResource: LanguageResource = {
  args: ["word"],
  name: "Michaelis BR",
  outputs: ["word", "pos", "definition", "targetExampleSentences"],
  route: "api/michaelis-br/",
  healthRoute: "api/michaelis-br/abacaxi",
  supportedLanguages: ["português"],
} as LanguageResource;

export const supportedLanguagesResponse = {
  languages: ["english", "português"],
};

export const resourcesResponse = {
  resources: [wordReferenceResource, michaelisResource],
};
