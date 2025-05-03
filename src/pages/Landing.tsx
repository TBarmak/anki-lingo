import { Link } from "react-router-dom";
import waves from "../assets/waves.svg";
import { motion } from "framer-motion";
import {
  DELAY,
  EXIT,
  FADE_UP,
  HOVER,
  TRANSITION,
  TAP,
} from "../constants/animations";
import { useEffect } from "react";
import { resetFormState } from "../components/forms/utils/resetFormState";
import { useDispatch } from "react-redux";

export default function Landing() {
  const dispatch = useDispatch();

  useEffect(() => {
    resetFormState(dispatch);
  }, []);

  return (
    <motion.div
      className="route-component min-h-screen h-full relative flex flex-col justify-center items-center"
      variants={{
        exit: EXIT.DEFAULT,
      }}
      exit="exit"
    >
      <div className="flex flex-col justify-center items-center flex-1 min-h-96">
        <motion.p
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          transition={TRANSITION.WITH_DELAY(DELAY.SHORT)}
          className="secondary-text text-6xl font-bold font-['Lora'] my-2"
        >
          Anki Lingo
        </motion.p>
        <motion.p
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          transition={TRANSITION.WITH_DELAY(DELAY.LONG)}
          className="secondary-text text-xl text-center my-2"
        >
          Automate generating Anki flashcards for learning foreign languages.
        </motion.p>
        <Link to="/home">
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            transition={TRANSITION.WITH_DELAY(DELAY.EXTRA_LONG)}
          >
            <motion.div
              className="button mt-32 mb-12"
              whileHover={HOVER.SCALE}
              whileTap={TAP.SCALE}
            >
              <div className="text-center">Get Started</div>
            </motion.div>
          </motion.div>
        </Link>
      </div>
      <motion.div
        variants={FADE_UP}
        initial="hidden"
        animate="visible"
        transition={TRANSITION.WITH_DELAY(DELAY.EXTRA_LONG)}
        className="w-full absolute bottom-0 -z-10"
      >
        <img src={waves} className="w-full h-full object-bottom object-cover" />
      </motion.div>
    </motion.div>
  );
}
