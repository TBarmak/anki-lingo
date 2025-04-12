import { motion } from "framer-motion";
import { InputFields } from "../../../types/types";
import { IoChevronBackOutline } from "react-icons/io5";
import { useState } from "react";

type Props = {
  setInputFields: React.Dispatch<React.SetStateAction<InputFields>>;
}

export default function WordTextArea({ setInputFields }: Props) {
  const [words, setWords] = useState<string>("");

  return (
    <motion.div
      key="word-entry"
      className="py-8 px-8 sm:px-16 md:px-24 lg:px-64 flex flex-col justify-center w-full min-h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.75 } }}
    >
      <div>
        <motion.button
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 1.25 }}
          onClick={() => setInputFields({} as InputFields)}
          className="text-lg flex items-center"
        >
          <div className="group hover:cursor-pointer flex items-center">
            <div className="flex flex-col justify-center items-start">
              <IoChevronBackOutline color="#162e50" />
              <div className="h-0.5" />
            </div>
            <div className="flex flex-col justify-center items-start">
              <p className="mx-1 secondary-text">Go back</p>
              <div
                className={
                  "max-w-0 group-hover:max-w-full transition-all duration-300 rounded-full w-full h-0.5 bg-black"
                }
              />
            </div>
          </div>
        </motion.button>
        <motion.p
          className="text-3xl font-bold text-center my-4"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.5 }}
        >
          Enter words and/or phrases in the target language
        </motion.p>
        <motion.div
          className="mb-4 flex flex-col w-full"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.75 }}
        >
          <p className="font-bold secondary-text">Words/Phrases</p>
          <textarea
            name="words"
            className="w-full secondary-text h-full min-h-60 resize-none p-3 rounded-lg input text-lg"
            placeholder={
              "Enter words in the target language, with each word on a new line. For example:\nabacaxi\nfalar\npalavra"
            }
            value={words}
            onChange={(e) => setWords(e.target.value)}
          />
        </motion.div>
        <div className="flex flex-row w-full justify-center my-8">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 1.25 }}
          >
            <motion.button
              className="button"
              whileHover={!words ? undefined : { scale: 1.05 }}
              disabled={!words}
              onClick={() => {
                setInputFields((oldFields) => ({
                  ...oldFields,
                  words: words,
                }));
              }}
            >
              Continue
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
