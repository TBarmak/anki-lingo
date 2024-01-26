import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import {
  ExportField,
  FormErrors,
  InputFields,
  LanguageResource,
} from "../types/types";
import FormError from "../components/FormError";

export default function Main() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputFields, setInputFields] = useState<InputFields>({
    words: "",
    targetLanguage: "",
    nativeLanguage: "",
    languageResources: [],
    exportFields: [],
  });
  const [errors, setErrors] = useState<FormErrors>({} as FormErrors);
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);
  const [languageResources, setLanguageResources] = useState<
    LanguageResource[]
  >([]);

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
    const resourceNames = ([] as string[]).concat(
      ...inputFields.languageResources
        .filter((resource: LanguageResource) => resource.isSelected)
        .map((resource: LanguageResource) => resource.outputs)
    );
    const exportFields: ExportField[] = [...new Set(resourceNames)].reduce(
      (acc, curr) => {
        acc.push({ name: curr, isSelected: true });
        return acc;
      },
      [] as ExportField[]
    );
    setInputFields({ ...inputFields, exportFields: exportFields });
  }, [inputFields.languageResources]);

  useEffect(() => {
    setInputFields({ ...inputFields, languageResources: languageResources });
  }, [languageResources]);

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
    if (inputFields.exportFields.length === 0) {
      errors.exportFields =
        "Please select at least one field to include in the flashcards";
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

  function handleCheckboxChange(
    e: React.ChangeEvent<HTMLInputElement>,
    checkboxField: "languageResources" | "exportFields"
  ) {
    const newCheckboxField = inputFields[checkboxField].map((field) => {
      if (field.name === e.target.name) {
        field.isSelected = !field.isSelected;
      }
      return field;
    });
    setInputFields({ ...inputFields, [checkboxField]: [...newCheckboxField] });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(inputFields);
    setErrors(validateForm(inputFields));
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-screen flex flex-row items-center justify-center bg-blue-200">
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
          <div className="flex-1 py-2">
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
          <div className="flex-1 py-2">
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
          <div className="flex-1 flex flex-col">
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
                    onChange={(e) =>
                      handleCheckboxChange(e, "languageResources")
                    }
                  />
                  {resource.name}
                </label>
              );
            })}
            {languageResources.length > 0 && (
              <FormError message={errors.languageResources} />
            )}
          </div>
          <div className="flex-1"></div>
          <div className="flex-1">
            <button
              type="submit"
              className="bg-black disabled:bg-gray-700 text-white rounded-xl px-8 py-2 transition-all duration-300"
            >
              Generate
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
