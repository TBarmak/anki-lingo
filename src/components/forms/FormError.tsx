import { AnimatePresence, motion } from "framer-motion";

interface Props {
  message?: string;
}

export default function FormError({ message }: Props) {
  return message ? (
    <AnimatePresence>
      <motion.p
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: {
            opacity: 0,
            transition: { ease: "easeInOut", duration: 0.5 },
          },
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5 }}
        className="text-sm accent-text"
      >
        {message}
      </motion.p>
    </AnimatePresence>
  ) : (
    <p>&nbsp;</p>
  );
}
