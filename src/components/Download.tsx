import moment from "moment";
import { motion } from "framer-motion";
import { WordScrapeError } from "../types/types";

interface Props {
  downloadUrl: string;
  errors: WordScrapeError[];
}

export default function Download({ downloadUrl, errors }: Props) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
        exit: {
          opacity: 0,
          transition: { ease: "easeInOut" },
        },
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.75, delay: 0.5 }}
      className="w-full h-full flex flex-col justify-center items-center px-[20%]"
    >
      <p className="text-5xl secondary-text my-2 font-bold">
        Your csv is ready to be downloaded.
      </p>
      <p className="text-lg secondary-text mt-2 mb-4">
        For instructions on how to import the files into Anki, please see{" "}
        <a className="underline" href="https://github.com/TBarmak/anki-lingo">
          this article
        </a>
        .
      </p>
      {errors.length > 0 && (
        <div>
          <p className="accent-text">Error fetching data for:</p>
          <div className="h-16 overflow-scroll">
            {errors.map((error) => {
              return (
                <p className="accent-text">
                  {error.word}: {error.errors.join(", ")}
                </p>
              );
            })}
          </div>
        </div>
      )}
      <a
        className="my-16 mt-24"
        href={downloadUrl}
        download={`anki-lingo-${moment().format("YYYYMMDDHHmmss")}.zip`}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 100 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.75, delay: 1 }}
        >
          <motion.button className="button" whileHover={{ scale: 1.05 }}>
            Download
          </motion.button>
        </motion.div>
      </a>
    </motion.div>
  );
}
