import moment from "moment";
import { motion } from "framer-motion";
import { WordScrapeError } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import GoBack from "./GoBack";
import { setDownloadUrl } from "../store/rootSlice";
import formStyles from "./forms/shared.module.css";
export default function Download() {
  const { downloadUrl, scrapedData } = useSelector(
    (state: RootState) => state.root
  );
  const dispatch = useDispatch();

  function getErrors(): WordScrapeError[] {
    return scrapedData
      .filter((scrapedWordData) => scrapedWordData.errors?.length)
      .map((scrapedWordData) => {
        return {
          word: scrapedWordData.inputWord,
          errors: scrapedWordData.errors ?? [],
        };
      });
  }

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
      className={formStyles.formContainer}
    >
      <div className="flex flew-row justify-start items-center w-full">
        <GoBack goToPreviousStep={() => dispatch(setDownloadUrl(""))} />
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <p className="text-5xl secondary-text my-2 font-bold">
          Your csv is ready to be downloaded.
        </p>
        <p className="text-lg secondary-text mt-2 mb-4">
          For instructions on how to import the files into Anki, please see{" "}
          <a
            className="underline"
            href="https://github.com/TBarmak/anki-lingo/blob/main/README.md"
          >
            this article
          </a>
          .
        </p>
        {getErrors().length > 0 && (
          <div>
            <p className="accent-text">Error fetching data for:</p>
            <div className="h-16 overflow-scroll">
              {getErrors().map((error) => {
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
      </div>
    </motion.div>
  );
}
