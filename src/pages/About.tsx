import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { DELAY, EXIT, FADE_UP, HOVER, TRANSITION } from "../constants/animations";

export default function About() {
  return (
    <motion.div
      className="route-component flex flex-col justify-center items-center min-h-screen"
      variants={{
        exit: EXIT.DEFAULT,
      }}
      exit="exit"
    >
      <motion.p
        className="secondary-text px-[20%] text-lg"
        variants={FADE_UP}
        initial="hidden"
        animate="visible"
        transition={TRANSITION.WITH_DELAY(DELAY.SHORT)}
      >
        <span className="font-bold text-xl italic">Anki Lingo</span> is a tool
        for automating the creation of Anki flashcards for language learning.
        Simply select the target and native language, enter vocab words, and
        select the resources that you'd like to use to create the flashcards.
        After scraping the data, you can design your flashcards by selecting
        which fields you'd like to include on each side. Finally, Anki Lingo
        will produce a zip file that contains a csv and any audio files for the
        words.
      </motion.p>
      <div className="flex flex-row justify-center w-full my-16">
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          transition={TRANSITION.WITH_DELAY(DELAY.LONG)}
        >
          <a href="https://github.com/TBarmak">
            <motion.div
              className="mx-4 hover:cursor-pointer"
              whileHover={HOVER.SCALE}
            >
              <FaGithub color="#162e50" size={64} />
            </motion.div>
          </a>
        </motion.div>
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          transition={TRANSITION.WITH_DELAY(DELAY.EXTRA_LONG)}
        >
          <a href="https://www.linkedin.com/in/taylorbarmak/">
            <motion.div
              className="mx-4 hover:cursor-pointer"
              whileHover={HOVER.SCALE}
            >
              <FaLinkedin color="#162e50" size={64} />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
