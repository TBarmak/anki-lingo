import { useEffect, useState } from "react";
import {
  CombinedScrapedResponse,
  FormErrors,
  InputFields,
  LanguageResource,
  ScrapedResponse,
} from "../../types/types";
import FormError from "./FormError";
import { getFlashcardData } from "./utils/getFlashcardData";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setScrapedData: React.Dispatch<
    React.SetStateAction<(ScrapedResponse | CombinedScrapedResponse)[]>
  >;
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
    } else {
      setLanguageResources([]);
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
      errors.targetLanguage =
        "Target language must be different from native language";
    }
    if (
      inputFields.languageResources.length > 0 &&
      inputFields.languageResources.filter((resource) => resource.isSelected)
        .length === 0
    ) {
      errors.languageResources = "Please select at least one resource";
    }
    return errors;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const newInputFields: InputFields = {
      ...inputFields,
      [e.target.name]: e.target.value,
    };

    // Clear form errors that are no longer present
    const newErrors = validateForm(newInputFields);
    for (const key in errors) {
      if (!newErrors[key as keyof FormErrors]) {
        errors[key as keyof FormErrors] = "";
      }
    }

    // Update the error for the changed field
    errors[e.target.name as keyof FormErrors] =
      newErrors[e.target.name as keyof FormErrors];
    setErrors(errors);
    setInputFields(newInputFields);
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
    const newInputFields = {
      ...inputFields,
      languageResources: [...newCheckboxField],
    };
    const newErrors = validateForm(newInputFields);
    errors.languageResources = newErrors.languageResources;
    setErrors(errors);
    setInputFields(newInputFields);
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
    <motion.form
      className="py-8 px-20 flex flex-col md:flex-row justify-between w-full min-h-full h-full"
      onSubmit={handleSubmit}
      variants={{
        exit: {
          opacity: 0,
          transition: { ease: "easeInOut", duration: 0.75 },
        },
      }}
      exit="exit"
    >
      <motion.div
        className="flex-1 p-4"
        variants={{
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.75, delay: 0.5 }}
      >
        <textarea
          name="words"
          className="w-full secondary-text h-full min-h-60 resize-none p-3 rounded-lg input text-lg"
          placeholder={
            "Enter words in the target language, with each word on a new line. For example:\nabacaxi\nfalar\npalavra"
          }
          value={inputFields.words}
          onChange={handleChange}
        />
        <FormError message={errors.words} />
      </motion.div>
      <div className="h-full flex-1 p-4 flex flex-col items-center">
        <div className="flex-1 flex flex-col items-center w-full px-12 md:px-24">
          <motion.div
            className="mb-4 flex flex-col w-full"
            variants={{
              hidden: { opacity: 0, x: 100 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.75, delay: 0.5 }}
          >
            <select
              name="targetLanguage"
              className="secondary-text p-2 pr-8 rounded-lg input text-lg"
              value={inputFields.targetLanguage}
              onChange={handleChange}
            >
              <option value="">Select target language</option>
              {supportedLanguages.map((language, index) => {
                return (
                  <option key={index} value={language}>
                    {language}
                  </option>
                );
              })}
            </select>
            <FormError message={errors.targetLanguage} />
          </motion.div>
          <motion.div
            className="mb-4 flex flex-col w-full"
            variants={{
              hidden: { opacity: 0, x: 100 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.75, delay: 0.75 }}
          >
            <select
              name="nativeLanguage"
              className="secondary-text p-2 pr-8 rounded-lg input text-lg"
              value={inputFields.nativeLanguage}
              onChange={handleChange}
            >
              <option value="">Select native language</option>
              {supportedLanguages.map((language, index) => {
                return (
                  <option key={index} value={language}>
                    {language}
                  </option>
                );
              })}
            </select>
            <FormError message={errors.nativeLanguage} />
          </motion.div>
          <AnimatePresence>
            {inputFields.languageResources.length > 0 &&
              inputFields.nativeLanguage &&
              inputFields.nativeLanguage !== inputFields.targetLanguage && (
                <motion.div
                  className="flex-1 flex flex-col w-full px-20 my-4"
                  variants={{
                    hidden: { opacity: 0, x: 100 },
                    visible: { opacity: 1, x: 0 },
                    exit: {
                      opacity: 0,
                      transition: { duration: 0.75 },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.75, delay: 0 }}
                >
                  <p className="text-lg my-2">
                    Select the resources you would like to use to generate the
                    flashcards:
                  </p>

                  {inputFields.languageResources.map((resource, index) => {
                    return (
                      <motion.label
                        key={resource.name + inputFields.targetLanguage}
                        className="flex flex-row items-center text-lg"
                        variants={{
                          hidden: { opacity: 0, x: 100 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        initial="hidden"
                        animate="visible"
                        transition={{
                          duration: 0.75,
                          delay: (index + 1) * 0.25,
                        }}
                      >
                        <input
                          name={resource.name}
                          type="checkbox"
                          className="mx-2 hidden"
                          checked={resource.isSelected ?? false}
                          onChange={(e) => handleResourceCheckboxChange(e)}
                        />
                        <div className="mx-2">
                          {resource.isSelected ? (
                            <MdCheckBox color="#162e50" size={24} />
                          ) : (
                            <MdCheckBoxOutlineBlank color="#162e50" size={24} />
                          )}
                        </div>
                        {resource.name}
                      </motion.label>
                    );
                  })}
                  {languageResources.length > 0 && (
                    <FormError message={errors.languageResources} />
                  )}
                </motion.div>
              )}
          </AnimatePresence>
        </div>
        <motion.div
          className="mt-12"
          variants={{
            hidden: { opacity: 0, y: 100 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.75, delay: 1 }}
        >
          <motion.button
            type="submit"
            className="button"
            whileHover={{ scale: 1.05 }}
          >
            Generate
          </motion.button>
        </motion.div>
      </div>
    </motion.form>
  );
}
