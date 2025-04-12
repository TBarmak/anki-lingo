import { motion } from "framer-motion";
import type {
  InputFields,
  LanguageResource,
} from "../../../types/types";
import { IoChevronBackOutline } from "react-icons/io5";
import { getFlashcardData } from "../utils/getFlashcardData";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setIsLoading, setScrapedData } from "../../../store/slice";

type Props = {
  inputFields: InputFields;
  setLanguageResources: React.Dispatch<
    React.SetStateAction<LanguageResource[]>
  >;
  languageResources: LanguageResource[];
  goToPreviousStep: () => void;
};

export default function ResourceSelector({
  setLanguageResources,
  languageResources,
  inputFields,
  goToPreviousStep,
}: Props) {
  const dispatch = useDispatch();

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
    dispatch(setIsLoading(true));
    getFlashcardData({ ...inputFields, languageResources }).then((res) => {
      dispatch(setScrapedData(res));
      dispatch(setIsLoading(false));
    });
  }

  return (
    <div className="py-8 flex flex-col justify-center w-full min-h-full">
      <div>
        <motion.button
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 1.25 }}
          onClick={() => goToPreviousStep()}
          className="text-lg flex items-center"
        >
          <div className="group hover:cursor-pointer flex items-center">
            <div className="flex flex-col justify-center items-start">
              <IoChevronBackOutline color="#162e50" />
              <div className="h-0.5" />
            </div>
            <div className="flex flex-col justify-center items-start">
              <p className="mx-1 secondary-text">Go back</p>
              <div
                className={
                  "max-w-0 group-hover:max-w-full transition-all duration-300 rounded-full w-full h-0.5 bg-black"
                }
              />
            </div>
          </div>
        </motion.button>
        <motion.p
          className="text-3xl font-bold text-center my-4"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.5 }}
        >
          Select resources
        </motion.p>
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
          transition={{ duration: 0.75, delay: 0.75 }}
        >
          <p className="text-lg my-2">
            Select the resource(s) you would like to use to generate the
            flashcards:
          </p>

          {languageResources.map((resource, index) => {
            return (
              <motion.label
                key={resource.name + inputFields.targetLanguage + index}
                className="flex flex-row items-center text-lg"
                variants={{
                  hidden: { opacity: 0, x: 100 },
                  visible: { opacity: 1, x: 0 },
                }}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.75,
                  delay: (index + 1) * 0.25 + 0.5,
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
        <div className="flex flex-row justify-center my-8">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 1.25 }}
          >
            <motion.button
              onClick={handleSubmit}
              whileHover={
                !languageResources.some((resource) => resource.isSelected)
                  ? undefined
                  : { scale: 1.05 }
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
