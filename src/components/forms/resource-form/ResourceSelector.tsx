import { motion } from "framer-motion";
import { getFlashcardData } from "../utils/getFlashcardData";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading, setScrapedData } from "../../../store/rootSlice";
import { RootState } from "../../../store";
import { setLanguageResources } from "../../../store/resourceFormSlice";
import formStyles from "../shared.module.css";
import {
  DELAY,
  FADE_DOWN,
  FADE_RIGHT,
  FADE_UP,
  HOVER,
  TAP,
  TRANSITION,
} from "../../../constants/animations";

export default function ResourceSelector() {
  const dispatch = useDispatch();
  const { words, targetLanguage, nativeLanguage, languageResources } =
    useSelector((state: RootState) => state.resourceForm);

  function handleResourceCheckboxChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const updatedLanguageResources = languageResources.map((field) => {
      if (field.name === e.target.name) {
        return { ...field, isSelected: !field.isSelected };
      }
      return field;
    });
    dispatch(setLanguageResources(updatedLanguageResources));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(setIsLoading(true));
    getFlashcardData({
      words,
      targetLanguage,
      nativeLanguage,
      languageResources,
    }).then((res) => {
      dispatch(setScrapedData(res));
      dispatch(setIsLoading(false));
    });
  }

  return (
    <div className={formStyles.formStepContainer}>
      <div className="flex flex-col items-center justify-center">
        <motion.p
          className={formStyles.formStepTitle}
          variants={FADE_DOWN}
          initial="hidden"
          animate="visible"
          transition={TRANSITION.WITH_DELAY(DELAY.MEDIUM)}
        >
          Select resource(s) to generate flashcards
        </motion.p>
        <motion.div
          className="flex-1 flex flex-col items-center"
          variants={FADE_RIGHT}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={TRANSITION.WITH_DELAY(DELAY.LONG)}
        >
          <div className="flex flex-col items-start justify-center">
            {languageResources.map((resource, index) => {
              return (
                <motion.label
                  key={resource.name + targetLanguage + index}
                  className="flex flex-row items-center text-lg my-1 sm:my-0.5"
                  variants={FADE_RIGHT}
                  initial="hidden"
                  animate="visible"
                  transition={TRANSITION.WITH_DELAY(DELAY.SHORT + index * 0.25)}
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
          </div>
        </motion.div>
        <div className="flex flex-row justify-center my-16">
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            transition={TRANSITION.WITH_DELAY(DELAY.EXTRA_LONG)}
          >
            <motion.button
              onClick={handleSubmit}
              whileHover={
                !languageResources.some((resource) => resource.isSelected)
                  ? undefined
                  : HOVER.SCALE
              }
              whileTap={
                !languageResources.some((resource) => resource.isSelected)
                  ? undefined
                  : TAP.SCALE
              }
              disabled={
                !languageResources.some((resource) => resource.isSelected)
              }
              className="button"
            >
              Generate
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
