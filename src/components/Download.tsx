import moment from "moment";
import { motion } from "framer-motion";

interface Props {
  downloadUrl: string;
}

export default function Download({ downloadUrl }: Props) {
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
      <p className="text-lg secondary-text mt-2 mb-16">
        For instructions on how to import the files into Anki, please see{" "}
        <a className="underline" href="https://github.com/TBarmak/anki-lang">
          this article
        </a>
        .
      </p>
      <a
        className="my-16"
        href={downloadUrl}
        download={`anki-lang-${moment().format("YYYYMMDDHHmmss")}.zip`}
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
