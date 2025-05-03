import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { setWords } from "../../../store/resourceFormSlice";
import formStyles from "../shared.module.css";
import {
  DELAY,
  FADE_DOWN,
  FADE_UP,
  HOVER,
  TAP,
  TRANSITION,
} from "../../../constants/animations";

type Props = {
  goToNextStep: () => void;
};

export default function WordTextArea({ goToNextStep }: Props) {
  const { words } = useSelector((state: RootState) => state.resourceForm);
  const [textAreaValue, setTextAreaValue] = useState<string>(words || "");
  const dispatch = useDispatch();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setWords(textAreaValue));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [textAreaValue]);

  return (
    <div className={formStyles.formStepContainer}>
      <motion.p
        className={formStyles.formStepTitle}
        variants={FADE_DOWN}
        initial="hidden"
        animate="visible"
        transition={TRANSITION.WITH_DELAY(DELAY.MEDIUM)}
      >
        Enter words and/or phrases in the target language
      </motion.p>
      <motion.div
        className="mb-4 flex flex-col w-full"
        variants={FADE_UP}
        initial="hidden"
        animate="visible"
        transition={TRANSITION.WITH_DELAY(DELAY.LONG)}
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
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          transition={TRANSITION.WITH_DELAY(DELAY.EXTRA_LONG)}
        >
          <motion.button
            className="button"
            whileHover={!textAreaValue ? undefined : HOVER.SCALE}
            whileTap={!textAreaValue ? undefined : TAP.SCALE}
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
