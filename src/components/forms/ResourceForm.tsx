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
        if (
          !inputFields.targetLanguage ||
          !inputFields.nativeLanguage ||
          inputFields.targetLanguage === inputFields.nativeLanguage
        ) {
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
              <LanguageSelector setInputFields={setInputFields} />
            </motion.div>
          );
        } else if (!inputFields.words) {
          return (
            <motion.div
              key="word-entry"
              className="py-8 px-8 sm:px-16 md:px-24 lg:px-64 flex flex-col justify-center w-full min-h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.75 } }}
            >
              <WordTextArea setInputFields={setInputFields} />
            </motion.div>
          );
        } else {
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
                setInputFields={setInputFields}
                setLanguageResources={setLanguageResources}
                languageResources={languageResources}
              />
            </motion.div>
          );
        }
      })()}
    </AnimatePresence>
  );
}
