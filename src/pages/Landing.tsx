import { Link } from "react-router-dom";
import waves from "../assets/waves.svg";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <motion.div
      className="route-component min-h-screen h-full relative flex flex-col justify-center items-center"
      variants={{
        exit: {
          opacity: 0,
          transition: { ease: "easeInOut", duration: 0.75 },
        },
      }}
      exit="exit"
    >
      <div className="flex flex-col justify-center items-center flex-1 min-h-96">
        <motion.p
          variants={{
            hidden: { opacity: 0, y: -100 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.75, delay: 0.25 }}
          className="secondary-text text-6xl font-bold font-['Lora'] my-2"
        >
          Anki Lingo
        </motion.p>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 100 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.75, delay: 1 }}
          className="secondary-text text-xl text-center my-2"
        >
          Automate generating anki flashcards for learning foreign languages.
        </motion.p>
        <Link to="/home">
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
              className="button mt-32 mb-12"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center">Get Started</div>
            </motion.div>
          </motion.div>
        </Link>
      </div>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.75, delay: 1.25 }}
        className="w-full absolute bottom-0 -z-10"
      >
        <img src={waves} className="w-full h-full object-bottom object-cover" />
      </motion.div>
    </motion.div>
  );
}
