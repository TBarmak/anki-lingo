export interface InputFields {
    words: string;
    targetLanguage: string;
    nativeLanguage: string;
    languageResources: LanguageResource[];
    exportFields: ExportField[]
}

export interface LanguageResource {
    name: string;
    route: string;
    args: string[];
    outputs: string[];
    supportedLanguages: string[];
    isSelected?: boolean;
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