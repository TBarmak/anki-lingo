import { type ReactNode, useEffect, useState } from "react";
import type { InputFields, LanguageResource } from "../../types/types";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSelector from "./resource-form/LanguageSelector";
import WordTextArea from "./resource-form/WordTextArea";
import ResourceSelector from "./resource-form/ResourceSelector";

type Props = {
  setExportFields: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function ResourceForm({ setExportFields }: Props) {
  const [languageResources, setLanguageResources] = useState<
    LanguageResource[]
  >([]);
  const [inputFields, setInputFields] = useState<InputFields>(
    {} as InputFields
  );
  const [currentStep, setCurrentStep] = useState<
    "languages" | "words" | "resources"
  >("languages");

  useEffect(() => {
    setLanguageResources([]);
    if (inputFields.targetLanguage) {
      fetch(`api/resources/${inputFields.targetLanguage}`)
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
  }, [inputFields.targetLanguage]);

  useEffect(() => {
    if (languageResources.length) {
      const exportFields = ([] as string[]).concat(
        ...languageResources
          .filter((resource: LanguageResource) => resource.isSelected)
          .map((resource: LanguageResource) => resource.outputs)
      );
      setExportFields([...new Set(exportFields)]);
    }
  }, [languageResources]);

  return (
    <AnimatePresence mode="wait">
      {((): ReactNode => {
        switch (currentStep) {
          case "languages":
            return (
              <motion.div
                key="language-selection"
                className="py-8 px-8 sm:px-16 md:px-24 lg:px-64 flex flex-col justify-center w-full min-h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { ease: "easeInOut", duration: 0.75 },
                }}
              >
                <LanguageSelector
                  inputFields={inputFields}
                  setInputFields={setInputFields}
                  goToNextStep={() => setCurrentStep("words")}
                />
              </motion.div>
            );
          case "words":
            return (
              <motion.div
                key="word-entry"
                className="py-8 px-8 sm:px-16 md:px-24 lg:px-64 flex flex-col justify-center w-full min-h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.75 } }}
              >
                <WordTextArea
                  inputFields={inputFields}
                  setInputFields={setInputFields}
                  goToPreviousStep={() => setCurrentStep("languages")}
                  goToNextStep={() => setCurrentStep("resources")}
                />
              </motion.div>
            );
          case "resources":
            return (
              <motion.div
                key="resources-selection"
                className="py-8 px-8 sm:px-16 md:px-24 lg:px-64 flex flex-col justify-center w-full min-h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.75 } }}
              >
                <ResourceSelector
                  inputFields={inputFields}
                  setLanguageResources={setLanguageResources}
                  languageResources={languageResources}
                  goToPreviousStep={() => setCurrentStep("words")}
                />
              </motion.div>
            );
        }
      })()}
    </AnimatePresence>
  );
}
