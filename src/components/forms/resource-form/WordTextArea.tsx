import { motion } from "framer-motion";
import { useState } from "react";
import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { setWords } from "../../../store/resourceFormSlice";
import formStyles from "../shared.module.css";

type Props = {
  goToNextStep: () => void;
};

export default function WordTextArea({
  goToNextStep,
}: Props) {
  const { words } = useSelector((state: RootState) => state.resourceForm);
  const [textAreaValue, setTextAreaValue] = useState<string>(words || "");
  const dispatch = useDispatch();

  return (
    <div className={formStyles.formStepContainer}>
      <motion.p
        className="text-3xl font-bold text-center my-16"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.5 }}
      >
        Enter words and/or phrases in the target language
      </motion.p>
      <motion.div
        className="mb-4 flex flex-col w-full"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.75 }}
      >
        <p className="font-bold secondary-text">Words/Phrases</p>
        <textarea
          name="words"
          className="w-full secondary-text h-full min-h-60 resize-none p-3 rounded-lg input text-lg"
          placeholder={
            "Enter words in the target language, with each word on a new line. For example:\nabacaxi\nfalar\npalavra"
          }
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
        />
      </motion.div>
      <div className="flex flex-row w-full justify-center my-16">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 1.25 }}
        >
          <motion.button
            className="button"
            whileHover={!textAreaValue ? undefined : { scale: 1.05 }}
            disabled={!textAreaValue}
            onClick={() => {
              dispatch(setWords(textAreaValue));
              goToNextStep();
            }}
          >
            Continue
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
