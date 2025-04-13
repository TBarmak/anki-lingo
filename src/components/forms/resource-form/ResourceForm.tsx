import { type ReactNode, useEffect, useState } from "react";
import type { LanguageResource } from "../../../types/types";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSelector from "./LanguageSelector";
import WordTextArea from "./WordTextArea";
import ResourceSelector from "./ResourceSelector";
import { useDispatch, useSelector } from "react-redux";
import { setExportFields } from "../../../store/rootSlice";
import type { RootState } from "../../../store";
import { setLanguageResources } from "../../../store/resourceFormSlice";
import GoBack from "../../GoBack";
import formStyles from "../shared.module.css";

export default function ResourceForm() {
  const [currentStep, setCurrentStep] = useState<
    "languages" | "words" | "resources" | ""
  >("");
  const dispatch = useDispatch();
  const { words, targetLanguage, nativeLanguage, languageResources } =
    useSelector((state: RootState) => state.resourceForm);

  useEffect(() => {
    if (words.length > 0) {
      setCurrentStep("resources");
    } else if (targetLanguage && nativeLanguage) {
      setCurrentStep("words");
    } else {
      setCurrentStep("languages");
    }
  }, []);

  useEffect(() => {
    if (currentStep === "languages" && targetLanguage) {
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
          dispatch(setLanguageResources(data.resources));
        });
    }
  }, [targetLanguage]);

  useEffect(() => {
    if (languageResources.length) {
      const exportFields = ([] as string[]).concat(
        ...languageResources
          .filter((resource: LanguageResource) => resource.isSelected)
          .map((resource: LanguageResource) => resource.outputs)
      );
      dispatch(setExportFields([...new Set(exportFields)]));
    }
  }, [languageResources]);

  const sharedMotionProps = {
    className: formStyles.formContainer,
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  };

  return (
    <AnimatePresence mode="wait">
      {((): ReactNode => {
        switch (currentStep) {
          case "languages":
            return (
              <motion.div key="language-selection" {...sharedMotionProps}>
                <LanguageSelector
                  goToNextStep={() => setCurrentStep("words")}
                />
              </motion.div>
            );
          case "words":
            return (
              <motion.div key="word-entry" {...sharedMotionProps}>
                <motion.div
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 1.25 }}
                  className="w-full flex justify-start"
                >
                  <GoBack
                    goToPreviousStep={() => setCurrentStep("languages")}
                  />
                </motion.div>
                <WordTextArea
                  goToNextStep={() => setCurrentStep("resources")}
                />
              </motion.div>
            );
          case "resources":
            return (
              <motion.div key="resources-selection" {...sharedMotionProps}>
                <motion.div
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 1.25 }}
                  className="w-full flex justify-start"
                >
                  <GoBack goToPreviousStep={() => setCurrentStep("words")} />
                </motion.div>
                <ResourceSelector />
              </motion.div>
            );
          default:
            return <div />;
        }
      })()}
    </AnimatePresence>
  );
}
