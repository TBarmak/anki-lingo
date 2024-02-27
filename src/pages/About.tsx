import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.div
      className="route-component flex flex-col justify-center items-center min-h-screen"
      variants={{
        exit: {
          opacity: 0,
          transition: { ease: "easeInOut", duration: 0.75 },
        },
      }}
      exit="exit"
    >
      <motion.p
        className="secondary-text px-[20%] text-lg"
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1, delay: 0.25 }}
      >
        <span className="font-bold text-xl italic">Anki Lingo</span> is a tool
        for automating the creation of Anki flashcards for language learning.
        Simply enter vocab words, select the target and native language, and
        select the resources that you'd like to use to create the flashcards.
        After scraping the data, you can design your flashcards by selecting
        which fields you'd like to include on each side. Finally, Anki Lingo
        will produce a zip file that contains a csv and any audio files for the
        words.
      </motion.p>
      <div className="flex flex-row justify-center w-full my-16">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 100 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.75, delay: 0.75 }}
        >
          <motion.div
            className="mx-4 hover:cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <FaYoutube color="#162e50" size={64} />
          </motion.div>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 100 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.75, delay: 1 }}
        >
          <motion.div
            className="mx-4 hover:cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <FaGithub color="#162e50" size={64} />
          </motion.div>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 100 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.75, delay: 1.25 }}
        >
          <motion.div
            className="mx-4 hover:cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <FaLinkedin color="#162e50" size={64} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
