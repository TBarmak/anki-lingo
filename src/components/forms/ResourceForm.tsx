import { useEffect, useState } from "react";
import {
  CombinedScrapedResponse,
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
  const [words, setWords] = useState<string>("");
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const [nativeLanguage, setNativeLanguage] = useState<string>("");
  const [languageResources, setLanguageResources] = useState<
    LanguageResource[]
  >([]);
  const [touchedFields, setTouchedFields] = useState(new Set());

  useEffect(() => {
    fetch("api/supported-languages")
      .then((res) => res.json())
      .then((data) => setSupportedLanguages(data.languages));
  }, []);

  useEffect(() => {
    setLanguageResources([]);
    if (targetLanguage) {
      fetch(`api/resources/${targetLanguage}`)
        .then((res) => res.json())
        .then(async (data) => {
          const healthPromises: Promise<boolean>[] = data.resources.map(
            (resource: LanguageResource) => {
              return new Promise((res) => {
                fetch(resource.healthRoute).then((response) => {
                  resource["isHealthy"] = response.ok;
                  res(true);
                });
              });
            }
          );
          await Promise.all(healthPromises);
          setLanguageResources(data.resources);
        });
    } else {
      setLanguageResources([]);
    }
  }, [targetLanguage]);

  useEffect(() => {
    const exportFields = ([] as string[]).concat(
      ...languageResources
        .filter((resource: LanguageResource) => resource.isSelected)
        .map((resource: LanguageResource) => resource.outputs)
    );
    setExportFields([...new Set(exportFields)]);
  }, [languageResources]);

  function isFormValid(): boolean {
    if (words.length === 0) {
      return false;
    }
    if (targetLanguage === "") {
      return false;
    }
    if (nativeLanguage === "") {
      return false;
    } else if (nativeLanguage === targetLanguage) {
      return false;
    }
    if (
      languageResources.length > 0 &&
      languageResources.filter((resource) => resource.isSelected).length === 0
    ) {
      return false;
    }
    return true;
  }

  function handleResourceCheckboxChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const newCheckboxField = languageResources.map((field) => {
      if (field.name === e.target.name) {
        field.isSelected = !field.isSelected;
      }
      return field;
    });
    setLanguageResources(newCheckboxField);
  }

  const handleBlur = (e: React.FocusEvent) => {
    const target = e.target as HTMLInputElement;
    setTouchedFields((prev) => new Set(prev.add(target.name)));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouchedFields(
      new Set([
        "words",
        "targetLanguage",
        "nativeLanguage",
        "languageResources",
      ])
    );
    if (isFormValid()) {
      setIsLoading(true);
      getFlashcardData({
        words,
        targetLanguage,
        nativeLanguage,
        languageResources,
      }).then((res) => {
        setScrapedData(res);
        setIsLoading(false);
      });
    }
  }

  return (
    <motion.form
      className="py-8 px-16 md:px-24 flex flex-col md:flex-row justify-between w-full min-h-full"
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
        className="flex-[3] mb-6 w-full"
        variants={{
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.75, delay: 0.5 }}
      >
        <p className="font-bold secondary-text">Words/Phrases</p>
        <textarea
          name="words"
          onBlur={handleBlur}
          className="w-full secondary-text h-full min-h-60 resize-none p-3 rounded-lg input text-lg"
          placeholder={
            "Enter words in the target language, with each word on a new line. For example:\nabacaxi\nfalar\npalavra"
          }
          value={words}
          onChange={(e) => setWords(e.target.value)}
        />
        {touchedFields.has("words") && words.length === 0 && (
          <FormError message={"Please enter words in the target language"} />
        )}
      </motion.div>
      <div className="h-full w-full flex-[2] flex flex-col items-center md:pl-24">
        <div className="flex-1 flex flex-col items-center w-full">
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
            <p className="font-bold secondary-text">Target language</p>
            <select
              name="targetLanguage"
              onBlur={handleBlur}
              className="secondary-text p-2 pr-8 rounded-lg input text-lg"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
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
            {touchedFields.has("targetLanguage") && targetLanguage === "" && (
              <FormError message={"Please select the target language"} />
            )}
            {targetLanguage && targetLanguage === nativeLanguage && (
              <FormError
                message={
                  "Target language must be different from native language"
                }
              />
            )}
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
            <p className="font-bold secondary-text">Native language</p>
            <select
              name="nativeLanguage"
              onBlur={handleBlur}
              className="secondary-text p-2 pr-8 rounded-lg input text-lg"
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value)}
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
            {touchedFields.has("nativeLanguage") && nativeLanguage === "" && (
              <FormError message={"Please select your native language"} />
            )}
            {nativeLanguage && nativeLanguage === targetLanguage && (
              <FormError
                message={
                  "Native language must be different from target language"
                }
              />
            )}
          </motion.div>
          <AnimatePresence>
            {languageResources.length > 0 &&
              nativeLanguage &&
              nativeLanguage !== targetLanguage && (
                <motion.div
                  className="flex-1 flex flex-col w-full my-4"
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

                  {languageResources.map((resource, index) => {
                    return (
                      <motion.label
                        key={resource.name + targetLanguage}
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
                        <div
                          className={`mx-2 w-4 h-4 rounded-full relative ${
                            resource.isHealthy
                              ? "green-background"
                              : "accent-background"
                          }`}
                        >
                          <div className="absolute z-50 opacity-0 hover:opacity-100 w-max bg-white px-2 p-1 rounded-lg text-sm -top-1 transition-all duration-300">
                            {resource.isHealthy
                              ? "Working as expected"
                              : "Might be blocked or broken"}
                          </div>
                        </div>
                      </motion.label>
                    );
                  })}
                  {languageResources.length > 0 &&
                    touchedFields.has("languageResources") &&
                    languageResources.filter((resource) => resource.isSelected)
                      .length === 0 && (
                      <FormError
                        message={"Please select at least one resource"}
                      />
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
