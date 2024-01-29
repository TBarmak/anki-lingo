import { useEffect, useState } from "react";
import {
  ExportField,
  FormErrors,
  InputFields,
  LanguageResource,
  ResourceArgs,
  ScrapedItem,
  ScrapedResponse,
} from "../../types/types";
import FormError from "./FormError";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setScrapedData: React.Dispatch<React.SetStateAction<ScrapedResponse[]>>;
  setExportFields: React.Dispatch<React.SetStateAction<ExportField[]>>;
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
    const resourceNames = ([] as string[]).concat(
      ...inputFields.languageResources
        .filter((resource: LanguageResource) => resource.isSelected)
        .map((resource: LanguageResource) => resource.outputs)
    );
    const exportFields: ExportField[] = [...new Set(resourceNames)].reduce(
      (acc, curr) => {
        acc.push({ value: curr, side: 0 });
        return acc;
      },
      [] as ExportField[]
    );
    setExportFields(exportFields);
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

  function getFlashcardData() {
    const selectedResources = inputFields.languageResources.filter(
      (resource) => resource.isSelected
    );
    const words = inputFields.words.split("\n");
    const wordPromises: Promise<ScrapedResponse>[] = words.map((word) => {
      return new Promise((res) => {
        const args: { [K in ResourceArgs]: string } = {
          word: word,
          targetLang: inputFields.targetLanguage,
          nativeLang: inputFields.nativeLanguage,
        };

        const resourcePromises: Promise<ScrapedResponse>[] =
          selectedResources.map((resource) => {
            return new Promise((res) => {
              const url =
                resource.route +
                resource.args.map((argName) => args[argName]).join("/");
              fetch(url)
                .then((res) => res.json())
                .then((data: ScrapedResponse) => {
                  res(data);
                }).catch((err) => {
                  // TODO: Implement error handling
                  console.log(err);
                });
            });
          });

        Promise.all(resourcePromises).then((responses: ScrapedResponse[]) => {
          const combinedScraped: ScrapedItem[] = ([] as ScrapedItem[]).concat(
            ...responses
              .filter((response) => response.scrapedData)
              .map((response) => response.scrapedData)
          );
          res({ word: word, scrapedData: combinedScraped } as ScrapedResponse);
        });
      });
    });

    Promise.all(wordPromises).then((responses) => {
      setScrapedData(responses);
      setIsLoading(false);
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
      getFlashcardData();
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
