import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { FADE, EXIT, TRANSITION } from "../constants/animations";

export default function Loading() {
  const { current, total } = useSelector(
    (state: RootState) => state.root.wordProgress
  );
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <motion.div
      variants={{
        ...FADE,
        exit: EXIT.DEFAULT,
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={TRANSITION.DEFAULT}
      className="w-full h-full flex flex-col justify-center items-center"
    >
      <div className="my-4 w-64 h-3 rounded-full bg-gray-300 overflow-hidden">
        <motion.div
          className="h-full secondary-background rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={TRANSITION.DEFAULT}
        />
      </div>
      <p className="text-xl secondary-text">
        Creating your flashcards... {current} of {total} words/phrases
      </p>
    </motion.div>
  );
}
