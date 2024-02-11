import { useEffect, useState } from "react";
import {
  FormErrors,
  InputFields,
  LanguageResource,
  ScrapedResponse,
} from "../../types/types";
import FormError from "./FormError";
import { getFlashcardData } from "./utils/getFlashcardData";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setScrapedData: React.Dispatch<React.SetStateAction<ScrapedResponse[]>>;
  setExportFields: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function ResourceForm({
  setIsLoading,
  setScrapedData,
  setExportFields,
}: Props) {
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);
  const [languageResources, setLanguageResources] = useState<
    LanguageResource[]
  >([]);
  const [inputFields, setInputFields] = useState<InputFields>({
    words: "",
    targetLanguage: "",
    nativeLanguage: "",
    languageResources: [],
  });
  const [errors, setErrors] = useState<FormErrors>({} as FormErrors);

  useEffect(() => {
    fetch("/api/supported-languages")
      .then((res) => res.json())
      .then((data) => setSupportedLanguages(data.languages));
  }, []);

  useEffect(() => {
    const language = inputFields.targetLanguage;
    if (language) {
      fetch(`/api/resources/${inputFields.targetLanguage}`)
        .then((res) => res.json())
        .then((data) => setLanguageResources(data.resources));
    }
  }, [inputFields.targetLanguage]);

  useEffect(() => {
    setInputFields({ ...inputFields, languageResources: languageResources });
  }, [languageResources]);

  useEffect(() => {
    const exportFields = ([] as string[]).concat(
      ...inputFields.languageResources
        .filter((resource: LanguageResource) => resource.isSelected)
        .map((resource: LanguageResource) => resource.outputs)
    );
    setExportFields([...new Set(exportFields)]);
  }, [inputFields.languageResources]);

  function validateForm(inputFields: InputFields): FormErrors {
    let errors: FormErrors = {} as FormErrors;
    if (inputFields.words.length === 0) {
      errors.words = "Please enter words in the target language";
    }
    if (inputFields.targetLanguage === "") {
      errors.targetLanguage = "Please select the target language";
    }
    if (inputFields.nativeLanguage === "") {
      errors.nativeLanguage = "Please select your native language";
    } else if (inputFields.nativeLanguage === inputFields.targetLanguage) {
      errors.nativeLanguage =
        "Native language must be different from target language";
    }
    if (inputFields.languageResources.length === 0) {
      errors.languageResources = "Please select at least one resource";
    }
    return errors;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  }

  function handleResourceCheckboxChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const newCheckboxField = inputFields["languageResources"].map((field) => {
      if (field.name === e.target.name) {
        field.isSelected = !field.isSelected;
      }
      return field;
    });
    setInputFields({
      ...inputFields,
      languageResources: [...newCheckboxField],
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateForm(inputFields);
    const isSubmittable: boolean = Object.values(errors).every(
      (value) => value === ""
    );
    setErrors(errors);
    if (isSubmittable) {
      setIsLoading(true);
      getFlashcardData(inputFields).then((res) => {
        setScrapedData(res);
        setIsLoading(false);
      });
    }
  }

  return (
    <form
      className="py-20 px-20 flex flex-row justify-between w-full h-full"
      onSubmit={handleSubmit}
    >
      <div className="h-full flex-1 p-4">
        <textarea
          name="words"
          className="w-full h-full resize-none p-3 rounded-lg"
          placeholder={
            "Enter words in the target language, with each word on a new line. For example:\nabacaxi\nfalar\npalavra"
          }
          value={inputFields.words}
          onChange={handleChange}
        />
        <FormError message={errors.words} />
      </div>
      <div className="h-full flex-1 p-4 flex flex-col items-center">
        <div className="flex-1 w-full">
          <div className="mb-4 w-full">
            <select
              name="targetLanguage"
              className="p-2 pr-8 rounded-lg"
              value={inputFields.targetLanguage}
              onChange={handleChange}
            >
              <option value="-1">Select target language</option>
              {supportedLanguages.map((language, index) => {
                return (
                  <option key={index} value={language}>
                    {language}
                  </option>
                );
              })}
            </select>
            <FormError message={errors.targetLanguage} />
          </div>
          <div className="mb-4 w-full">
            <select
              name="nativeLanguage"
              className="p-2 pr-8 rounded-lg"
              value={inputFields.nativeLanguage}
              onChange={handleChange}
            >
              <option value="-1">Select native language</option>
              {supportedLanguages.map((language, index) => {
                return (
                  <option key={index} value={language}>
                    {language}
                  </option>
                );
              })}
            </select>
            <FormError message={errors.nativeLanguage} />
          </div>
        </div>
        <div className="flex-1 flex flex-col w-full">
          {inputFields.languageResources.length > 0 && (
            <p>
              Select the resources you would like to use to generate the
              flashcards:
            </p>
          )}
          {inputFields.languageResources.map((resource, index) => {
            return (
              <label key={index}>
                <input
                  name={resource.name}
                  type="checkbox"
                  className="mx-2"
                  checked={resource.isSelected ?? false}
                  onChange={(e) => handleResourceCheckboxChange(e)}
                />
                {resource.name}
              </label>
            );
          })}
          {languageResources.length > 0 && (
            <FormError message={errors.languageResources} />
          )}
        </div>

        <div className="">
          <button
            type="submit"
            className="bg-black disabled:bg-gray-700 text-white rounded-xl px-8 py-2 transition-all duration-300"
          >
            Generate
          </button>
        </div>
      </div>
    </form>
  );
}
