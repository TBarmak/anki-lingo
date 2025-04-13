import { AnimatePresence, motion } from "framer-motion";
import { EXIT, FADE, TRANSITION } from "../../constants/animations";

interface Props {
  message?: string;
}

export default function FormError({ message }: Props) {
  return message ? (
    <AnimatePresence>
      <motion.p
        variants={{
          ...FADE,
          exit: EXIT.DEFAULT,
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={TRANSITION.MEDIUM}
        className="text-sm accent-text"
      >
        {message}
      </motion.p>
    </AnimatePresence>
  ) : (
    <p>&nbsp;</p>
  );
}
