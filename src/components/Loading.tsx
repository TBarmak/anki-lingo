import { Bars } from "react-loader-spinner";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: {
          opacity: 0,
          transition: { ease: "easeInOut" },
        },
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.75 }}
      className="w-full h-full flex flex-col justify-center items-center"
    >
      <div className="my-4">
        <Bars height="60" width="60" color="#162e50" />
      </div>
      <p className="text-xl secondary-text">Creating your flashcards...</p>
    </motion.div>
  );
}
