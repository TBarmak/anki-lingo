import moment from "moment";
import { motion } from "framer-motion";
import { WordScrapeError } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import BackButton from "./BackButton";
import { setDownloadUrl } from "../store/rootSlice";
import formStyles from "./forms/shared.module.css";
import { DELAY, EXIT, FADE_UP, HOVER, TRANSITION } from "../constants/animations";

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
        ...FADE_UP,
        exit: EXIT.DEFAULT,
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={TRANSITION.WITH_DELAY(DELAY.MEDIUM)}
      className={formStyles.formContainer}
    >
      <div className="flex flew-row justify-start items-center w-full">
        <BackButton goToPreviousStep={() => dispatch(setDownloadUrl(""))} />
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <p className={`${formStyles.formStepTitle} my-2 text-5xl`}>
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
          className="my-16"
          href={downloadUrl}
          download={`anki-lingo-${moment().format("YYYYMMDDHHmmss")}.zip`}
        >
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            transition={TRANSITION.WITH_DELAY(DELAY.LONG)}
          >
            <motion.button className="button" whileHover={HOVER.SCALE}>
              Download
            </motion.button>
          </motion.div>
        </a>
      </div>
    </motion.div>
  );
}