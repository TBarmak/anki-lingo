import { Bars } from "react-loader-spinner";
import { motion } from "framer-motion";
import { FADE, EXIT, TRANSITION } from "../constants/animations";

export default function Loading() {
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
      <div className="my-4">
        <Bars height="60" width="60" color="#162e50" />
      </div>
      <p className="text-xl secondary-text">Creating your flashcards...</p>
    </motion.div>
  );
}
