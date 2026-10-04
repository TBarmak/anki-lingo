import { type ReactNode, useEffect, useState } from "react";
import type { LanguageResource } from "../../../types/types";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSelector from "./LanguageSelector";
import WordTextArea from "./WordTextArea";
import ResourceSelector from "./ResourceSelector";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { setLanguageResources } from "../../../store/resourceFormSlice";
import BackButton from "../../BackButton";
import formStyles from "../shared.module.css";
import {
  DELAY,
  FADE,
  FADE_DOWN,
  TRANSITION,
} from "../../../constants/animations";

const HEALTH_CHECK_TIMEOUT_MS = 10000;

export default function ResourceForm() {
  const dispatch = useDispatch();
  const { words, targetLanguage, nativeLanguage } = useSelector(
    (state: RootState) => state.resourceForm
  );
  const [currentStep, setCurrentStep] = useState<
    "languages" | "words" | "resources"
  >(() => {
    if (words.length > 0) return "resources";
    if (targetLanguage && nativeLanguage) return "words";
    return "languages";
  });

  useEffect(() => {
    if (currentStep === "languages" && targetLanguage) {
      fetch(`api/resources/${targetLanguage}`)
        .then((res) => res.json())
        .then(async (data) => {
          const healthPromises: Promise<boolean>[] = data.resources.map(
            (resource: LanguageResource) => {
              return new Promise((res) => {
                fetch(resource.healthRoute, {
                  signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT_MS),
                })
                  .then((response) => {
                    resource["isHealthy"] = response.ok;
                  })
                  .catch(() => {
                    resource["isHealthy"] = false;
                  })
                  .finally(() => {
                    res(true);
                  });
              });
            }
          );
          await Promise.all(healthPromises);
          dispatch(setLanguageResources(data.resources));
        });
    }
  }, [targetLanguage, currentStep, dispatch]);

  const sharedMotionProps = {
    className: formStyles.formContainer,
    variants: FADE,
    initial: "hidden",
    animate: "visible",
    exit: "exit",
    transition: TRANSITION.QUICK,
  };

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        window.scrollTo(0, 0);
      }}
    >
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
                  variants={FADE_DOWN}
                  initial="hidden"
                  animate="visible"
                  transition={TRANSITION.WITH_DELAY(DELAY.EXTRA_LONG)}
                  className="w-full flex justify-start"
                >
                  <BackButton
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
                  variants={FADE_DOWN}
                  initial="hidden"
                  animate="visible"
                  transition={TRANSITION.WITH_DELAY(DELAY.EXTRA_LONG)}
                  className="w-full flex justify-start"
                >
                  <BackButton
                    goToPreviousStep={() => setCurrentStep("words")}
                  />
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
