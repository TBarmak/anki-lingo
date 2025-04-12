import { useEffect, useState } from "react";
import {
  CombinedScrapedResponse,
  InputFields,
  LanguageResource,
  ScrapedResponse,
} from "../../types/types";
import { AnimatePresence } from "framer-motion";
import LanguageSelector from "./resource-form/LanguageSelector";
import WordTextArea from "./resource-form/WordTextArea";
import ResourceSelector from "./resource-form/ResourceSelector";

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
    const exportFields = ([] as string[]).concat(
      ...languageResources
        .filter((resource: LanguageResource) => resource.isSelected)
        .map((resource: LanguageResource) => resource.outputs)
    );
    setExportFields([...new Set(exportFields)]);
  }, [languageResources]);

  return (
    <AnimatePresence mode="wait">
      {!inputFields.targetLanguage ||
      !inputFields.nativeLanguage ||
      inputFields.targetLanguage === inputFields.nativeLanguage ? (
        <LanguageSelector setInputFields={setInputFields} />
      ) : !inputFields.words ? (
        <WordTextArea setInputFields={setInputFields} />
      ) : (
        <ResourceSelector
          inputFields={inputFields}
          setIsLoading={setIsLoading}
          setScrapedData={setScrapedData}
          setInputFields={setInputFields}
          setLanguageResources={setLanguageResources}
          languageResources={languageResources}
        />
      )}
    </AnimatePresence>
  );
}
