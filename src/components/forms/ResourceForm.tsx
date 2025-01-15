import { useEffect, useState } from "react";
import {
  CombinedScrapedResponse,
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
  const [words, setWords] = useState<string>("");
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const [nativeLanguage, setNativeLanguage] = useState<string>("");
  const [languageResources, setLanguageResources] = useState<
    LanguageResource[]
  >([]);
  const [inputFields, setInputFields] = useState<InputFields>(
    {} as InputFields
  );

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    getFlashcardData({ ...inputFields, languageResources }).then((res) => {
      setScrapedData(res);
      setIsLoading(false);
    });
  }

  if (
    !inputFields.targetLanguage ||
    !inputFields.nativeLanguage ||
    inputFields.targetLanguage === inputFields.nativeLanguage
  ) {
    return (
      <div className="py-8 px-16 md:px-24 flex flex-col justify-center w-full min-h-full">
        <div className="md:px-24">
          <p className="text-3xl font-bold text-center my-4">
            Enter your target language and native language
          </p>
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
            {nativeLanguage && nativeLanguage === targetLanguage && (
              <FormError
                message={
                  "Native language must be different from target language"
                }
              />
            )}
          </motion.div>
        </div>
        <div className="flex flex-row w-full justify-center my-8">
          <button
            className="button"
            disabled={
              !nativeLanguage ||
              !targetLanguage ||
              nativeLanguage === targetLanguage
            }
            onClick={() => {
              setInputFields({
                nativeLanguage: nativeLanguage,
                targetLanguage: targetLanguage,
              } as InputFields);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  } else if (!inputFields.words) {
    return (
      <div className="py-8 px-16 md:px-24 flex flex-col justify-center w-full min-h-full">
        <div className="md:px-24">
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
            <button onClick={() => setInputFields({} as InputFields)}>
              Go back
            </button>
            <p className="text-3xl font-bold text-center my-4">
              Enter words and/or phrases in the target language
            </p>
            <p className="font-bold secondary-text">Words/Phrases</p>
            <textarea
              name="words"
              className="w-full secondary-text h-full min-h-60 resize-none p-3 rounded-lg input text-lg"
              placeholder={
                "Enter words in the target language, with each word on a new line. For example:\nabacaxi\nfalar\npalavra"
              }
              value={words}
              onChange={(e) => setWords(e.target.value)}
            />
          </motion.div>
        </div>
        <div className="flex flex-row w-full justify-center my-8">
          <button
            className="button"
            disabled={!words}
            onClick={() => {
              setInputFields((oldFields) => {
                return {
                  ...oldFields,
                  words: words,
                };
              });
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-16 md:px-24 flex flex-col justify-center w-full min-h-full">
      <div className="md:px-24">
        <button
          onClick={() =>
            setInputFields((oldFields) => {
              return { ...oldFields, words: "" } as InputFields;
            })
          }
        >
          Go back
        </button>
        <p className="text-3xl font-bold text-center my-4">Select resources</p>
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
                      key={resource.name + targetLanguage + index}
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
              </motion.div>
            )}
        </AnimatePresence>
        <div className="flex flex-row justify-center my-8">
          <button
            onClick={handleSubmit}
            disabled={
              !languageResources.some((resource) => resource.isSelected)
            }
            className="button"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
