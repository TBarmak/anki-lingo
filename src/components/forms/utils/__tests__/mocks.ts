import {
  InputFields,
  LanguageResource,
  ScrapedResponse,
} from "../../../../types/types";

export const wordReferenceSelected: LanguageResource = {
  args: ["targetLang", "nativeLang", "word"],
  isSelected: true,
  name: "Word Reference",
  outputs: [
    "word",
    "pos",
    "definition",
    "translations",
    "targetExampleSentences",
    "nativeExampleSentences",
  ],
  route: "api/wr/",
  supportedLanguages: ["english", "español", "português", "français"],
} as LanguageResource;

export const wordReferenceNotSelected: LanguageResource = {
  args: ["targetLang", "nativeLang", "word"],
  name: "Word Reference",
  outputs: [
    "word",
    "pos",
    "definition",
    "translations",
    "targetExampleSentences",
    "nativeExampleSentences",
  ],
  route: "api/wr/",
  supportedLanguages: ["english", "español", "português", "français"],
} as LanguageResource;

export const michaelisSelected: LanguageResource = {
  args: ["word"],
  isSelected: true,
  name: "Michaelis BR",
  outputs: ["word", "pos", "definition", "targetExampleSentences"],
  route: "api/michaelis-br/",
  supportedLanguages: ["português"],
} as LanguageResource;

export const michaelisNotSelected: LanguageResource = {
  args: ["word"],
  name: "Michaelis BR",
  outputs: ["word", "pos", "definition", "targetExampleSentences"],
  route: "api/michaelis-br/",
  supportedLanguages: ["português"],
} as LanguageResource;

export const noWordsInput: InputFields = {
  words: "",
  targetLanguage: "Português",
  nativeLanguage: "English",
  languageResources: [],
};

export const abacaxiNoResourcesInput: InputFields = {
  words: "abacaxi",
  targetLanguage: "Português",
  nativeLanguage: "English",
  languageResources: [],
};

export const abacaxiWordReferenceInput: InputFields = {
  words: "abacaxi",
  targetLanguage: "Português",
  nativeLanguage: "English",
  languageResources: [wordReferenceSelected, michaelisNotSelected],
};

export const abacaxiMultiResourceInput: InputFields = {
  words: "abacaxi",
  targetLanguage: "Português",
  nativeLanguage: "English",
  languageResources: [wordReferenceSelected, michaelisSelected],
};

export const multiWordMichaelisInput: InputFields = {
  words: "abacaxi\nhomem",
  targetLanguage: "Português",
  nativeLanguage: "English",
  languageResources: [wordReferenceNotSelected, michaelisSelected],
};

export const multiWordMultiResourceInput: InputFields = {
  words: "abacaxi\nhomem",
  targetLanguage: "Português",
  nativeLanguage: "English",
  languageResources: [wordReferenceSelected, michaelisSelected],
};

export const abacaxiWordReferenceResponse: ScrapedResponse = {
  inputWord: "abacaxi",
  scrapedWordData: [
    {
      definition: "",
      nativeExampleSentences: [],
      pos: "sm",
      targetExampleSentences: [],
      translations: ["pineapple"],
      word: "abacaxi",
    },
  ],
  url: "https://www.wordreference.com/pten/abacaxi",
};

export const homemWordReferenceResponse: ScrapedResponse = {
  scrapedWordData: [
    {
      definition: "",
      nativeExampleSentences: [],
      pos: "sm",
      targetExampleSentences: [],
      translations: ["man"],
      word: "homem",
    },
    {
      definition: "(ser humano)",
      nativeExampleSentences: [],
      pos: "sm",
      targetExampleSentences: [],
      translations: ["man", "person", "human", "human being"],
      word: "homem",
    },
    {
      definition: "(do sexo masculino)",
      nativeExampleSentences: [],
      pos: "sm",
      targetExampleSentences: [],
      translations: ["man", "male"],
      word: "homem",
    },
    {
      definition: "(homem adulto)",
      nativeExampleSentences: [],
      pos: "sm",
      targetExampleSentences: [],
      translations: ["man", "adult"],
      word: "homem",
    },
    {
      definition:
        "(com coragem e for\u00e7a)\u00a0(figurative: upstanding or brave man)",
      nativeExampleSentences: [],
      pos: "sm",
      targetExampleSentences: [],
      translations: ["man"],
      word: "homem",
    },
    {
      definition: "(de confian\u00e7a)",
      nativeExampleSentences: [],
      pos: "sm",
      targetExampleSentences: [],
      translations: ["right-hand man"],
      word: "homem",
    },
    {
      definition: "(indiv\u00edduo nas for\u00e7as armadas)\u00a0(military)",
      nativeExampleSentences: [],
      pos: "sm",
      targetExampleSentences: [],
      translations: ["man", "soldier"],
      word: "homem",
    },
    {
      definition: "(marido ou amante)",
      nativeExampleSentences: [],
      pos: "sm",
      targetExampleSentences: [],
      translations: ["man", "husband", "lover", "partner"],
      word: "homem",
    },
  ],
  inputWord: "homem",
  url: "https://www.wordreference.com/pten/homem",
};

// TODO: Update after polishing Michaelis endpoint
export const abacaxiMichaelisResponse: ScrapedResponse = {
  inputWord: "abacaxi",
  scrapedWordData: [
    {
      definition:
        "Agr, Bot Planta terrestre (Ananas comosus), da fam\u00edlia das bromeli\u00e1ceas, cultivada ou selvagem, nativa do Brasil, de folhas lineares com bordas espinhosas, que produz uma infrutesc\u00eancia carnosa; abacaxi-branco, abacaxizeiro, aberas, anan\u00e1s, nan\u00e1, nan\u00e1s, nanaseiro, pita.",
      pos: "sm",
      targetExampleSentences: [],
      word: "abacaxi",
    },
    {
      definition:
        "Bot Fruto dessa planta, grande e escamoso, de sulcos sim\u00e9tricos e forma c\u00f4nica, muito arom\u00e1tico e saboroso: .",
      pos: "sm",
      targetExampleSentences: [
        "\u201cAs freiras, importadas para \u2018salvar\u2019 a alma dos \u00edndios, criaram novas receitas aproveitando as frutas ex\u00f3ticas locais (abacaxi, goiaba e papaia) [\u2026]\u201d",
      ],
      word: "abacaxi",
    },
    {
      definition: ", acep\u00e7\u00e3o 2.",
      pos: "sm",
      targetExampleSentences: [],
      word: "abacaxi",
    },
    {
      definition: "Mau dan\u00e7ador, desajeitado, pesad\u00e3o.",
      pos: "sm",
      targetExampleSentences: [],
      word: "abacaxi",
    },
    {
      definition: ", Mil Granada de m\u00e3o.",
      pos: "sm",
      targetExampleSentences: [],
      word: "abacaxi",
    },
    {
      definition:
        "Trabalho dif\u00edcil de ser realizado; algo complicado, intrincado.",
      pos: "sm",
      targetExampleSentences: [],
      word: "abacaxi",
    },
    {
      definition:
        "Indiv\u00edduo ou coisa desagrad\u00e1vel, ma\u00e7ante, complicada, perigosa.  variedade de abacaxi de formato cil\u00edndrico ou arredondado, pouco alongado, com a coroa sem espinhos, de polpa esbranqui\u00e7ada, adocicado, por\u00e9m com pouco equil\u00edbrio entre acidez e a\u00e7\u00facar.",
      pos: "sm",
      targetExampleSentences: [],
      word: "abacaxi",
    },
  ],
  url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/abacaxi",
};

export const homemMichaelisResponse: ScrapedResponse = {
  scrapedWordData: [
    {
      definition:
        "Biol Mam\u00edfero da ordem dos primatas, do g\u00eanero Homo, da esp\u00e9cie Homo sapiens, de posi\u00e7\u00e3o ereta e m\u00e3os pre\u00eanseis, com atividade cerebral inteligente, e programado para produzir linguagem articulada.",
      pos: "sm",
      targetExampleSentences: [],
      word: "homem",
    },
    {
      definition: "A esp\u00e9cie humana; a humanidade: .",
      pos: "sm",
      targetExampleSentences: [
        "\u201cO Homem \u00e9 uma inven\u00e7\u00e3o dele mesmo. N\u00f3s n\u00e3o somos Natureza\u201d",
      ],
      word: "homem",
    },
    {
      definition: "O ser humano do sexo masculino: .",
      pos: "sm",
      targetExampleSentences: [
        "\u201cDesde crian\u00e7a os homens s\u00e3o colocados numa camisa de for\u00e7a, cujo resumo \u00e9 a famosa express\u00e3o \u2018homem n\u00e3o chora\u2019\u201d",
      ],
      word: "homem",
    },
    {
      definition: "Homem que j\u00e1 chegou \u00e0 idade adulta; homem-feito.",
      pos: "sm",
      targetExampleSentences: [],
      word: "homem",
    },
    {
      definition: "Adolescente do sexo masculino que atingiu a virilidade.",
      pos: "sm",
      targetExampleSentences: [],
      word: "homem",
    },
    {
      definition:
        "Homem dotado de atributos considerados m\u00e1sculos, como coragem, determina\u00e7\u00e3o, for\u00e7a f\u00edsica, vigor sexual etc.; macho: .",
      pos: "sm",
      targetExampleSentences: [
        "\u201c\u2013 N\u00e3o me fales nesse idiota! \u00c9 um homem imposs\u00edvel: chora, vive sempre ajoelhado a meus p\u00e9s, a beijar-me as m\u00e3os. Rid\u00edculo! Eu gosto de homem, homem\u2026! De maricas n\u00e3o venhas! \u2212 exclamou em tom brejeiro\u201d",
      ],
      word: "homem",
    },
    {
      definition:
        "O ser humano do sexo masculino caracterizado por sentimentos, virtudes, limita\u00e7\u00f5es etc., atributos compat\u00edveis com sua natureza: .",
      pos: "sm",
      targetExampleSentences: [
        "\u201cNa minha idade, hoje, sei que um homem de quarenta anos tem a mesma energia e o mesmo vigor de um jovem de vinte e poucos anos\u201d",
      ],
      word: "homem",
    },
    {
      definition: "Indiv\u00edduo que goza da confian\u00e7a de algu\u00e9m:",
      pos: "sm",
      targetExampleSentences: ["Um dos homens do coronel vivia sempre armado."],
      word: "homem",
    },
    {
      definition: "Marido ou amante: .",
      pos: "sm",
      targetExampleSentences: [
        "\u201c[\u2026] com a cabe\u00e7a encostada ao ombro do seu homem, ela suspirava feliz\u201d",
      ],
      word: "homem",
    },
    {
      definition:
        "Indiv\u00edduo que mant\u00e9m uma rela\u00e7\u00e3o afetiva com uma prostituta e a explora financeiramente.",
      pos: "sm",
      targetExampleSentences: [],
      word: "homem",
    },
    {
      definition:
        "Indiv\u00edduo que faz parte de um ex\u00e9rcito ou de uma organiza\u00e7\u00e3o militar (geralmente usado no plural).",
      pos: "sm",
      targetExampleSentences: [],
      word: "homem",
    },
    {
      definition: "A humanidade.",
      pos: "sm pl",
      targetExampleSentences: [],
      word: "homens",
    },
    {
      definition:
        "Indiv\u00edduos que fazem parte de uma institui\u00e7\u00e3o, organiza\u00e7\u00e3o etc.",
      pos: "sm pl",
      targetExampleSentences: [],
      word: "homens",
    },
    {
      definition: "magistrado, oficial de justi\u00e7a ou policial.",
      word: "Homem da lei",
    },
    {
      definition:
        "indiv\u00edduo que \u00e9 frequentador de bares e clubes noturnos.",
      word: "Homem da noite",
    },
    {
      definition: "a)Vhomem do povo; b)Rel um dos nomes de Exu1.",
      word: "Homem da rua",
    },
    {
      definition:
        "indiv\u00edduo ativo que p\u00f5e suas inten\u00e7\u00f5es em pr\u00e1tica.",
      word: "Homem de a\u00e7\u00e3o",
    },
    {
      definition: "indiv\u00edduo cujo comportamento \u00e9 correto e honesto.",
      word: "Homem de bem",
    },
    {
      definition: "indiv\u00edduo piedoso que consagrou sua vida a Deus.",
      word: "Homem de Deus",
    },
    {
      definition: "Vestadista.",
      word: "Homem de Estado",
    },
    {
      definition:
        "indiv\u00edduo que interpreta as leis e esclarece quest\u00f5es jur\u00eddicas; jurisconsulto, jurista.",
      word: "Homem de leis",
    },
    {
      definition:
        "indiv\u00edduo que se dedica \u00e0 atividade intelectual, especialmente escritor.",
      word: "Homem de letras",
    },
    {
      definition:
        "Antrop: homin\u00eddeo extinto que surgiu na \u00c1sia e Europa h\u00e1 cerca de 100 mil anos, de pequena estatura e presumidamente de capacidade cerebral intensa.",
      word: "Homem de Neandertal",
    },
    {
      definition:
        "indiv\u00edduo que se dedica a atividades comerciais e investimentos.",
      word: "Homem de neg\u00f3cios",
    },
    {
      definition:
        "a) indiv\u00edduo que cumpre o que promete; b) indiv\u00edduo que n\u00e3o conta mentiras.",
      word: "Homem de palavra",
    },
    {
      definition: "Vtesta de ferro.",
      word: "Homem de palha",
    },
    {
      definition: "indiv\u00edduo reservado, que fala pouco.",
      word: "Homem de poucas palavras",
    },
    {
      definition:
        "indiv\u00edduo en\u00e9rgico, que sabe impor sua autoridade.",
      word: "Homem de pulso",
    },
    {
      definition: "indiv\u00edduo que faz parte da alta sociedade.",
      word: "Homem de sociedade",
    },
    {
      definition:
        "indiv\u00edduo que pertence \u00e0s classes populares; homem da rua.",
      word: "Homem do povo",
    },
    {
      definition:
        "indiv\u00edduo que se dedica \u00e0 vida p\u00fablica, que ocupa um alto posto no Estado.",
      word: "Homem p\u00fablico",
    },
    {
      definition:
        "a) com franqueza, sem rodeios; b) com sinceridade, de maneira sincera.",
      word: "De homem para homem",
    },
  ],
  inputWord: "homem",
  url: "https://michaelis.uol.com.br/moderno-portugues/busca/portugues-brasileiro/homem",
};
