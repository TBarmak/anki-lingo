import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FormError from "../FormError";
import type { InputFields } from "../../../types/types";

type Props = {
  setInputFields: React.Dispatch<React.SetStateAction<InputFields>>;
};

export default function LanguageSelector({ setInputFields }: Props) {
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const [nativeLanguage, setNativeLanguage] = useState<string>("");

  useEffect(() => {
    fetch("api/supported-languages")
      .then((res) => res.json())
      .then((data) => setSupportedLanguages(data.languages));
  }, []);

  return (
    <div>
      <div>
        <motion.p
          className="text-3xl font-bold text-center my-4"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.5 }}
        >
          Enter your target language and native language
        </motion.p>
        <motion.div
          className="mb-4 flex flex-col w-full"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.75 }}
        >
          <p className="font-bold secondary-text">Target language</p>
          <select
            name="targetLanguage"
            className="secondary-text p-2 pr-8 rounded-lg input text-lg"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option value="">Select target language</option>
            {supportedLanguages.map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
          </select>
          {targetLanguage && targetLanguage === nativeLanguage && (
            <FormError
              message={"Target language must be different from native language"}
            />
          )}
        </motion.div>
        <motion.div
          className="mb-4 flex flex-col w-full"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 1 }}
        >
          <p className="font-bold secondary-text">Native language</p>
          <select
            name="nativeLanguage"
            className="secondary-text p-2 pr-8 rounded-lg input text-lg"
            value={nativeLanguage}
            onChange={(e) => setNativeLanguage(e.target.value)}
          >
            <option value="">Select native language</option>
            {supportedLanguages.map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
          </select>
          {nativeLanguage && nativeLanguage === targetLanguage && (
            <FormError
              message={"Native language must be different from target language"}
            />
          )}
        </motion.div>
      </div>
      <div className="flex flex-row w-full justify-center my-8">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 1.25 }}
        >
          <motion.button
            className="button"
            whileHover={
              !nativeLanguage ||
              !targetLanguage ||
              nativeLanguage === targetLanguage
                ? undefined
                : { scale: 1.05 }
            }
            disabled={
              !nativeLanguage ||
              !targetLanguage ||
              nativeLanguage === targetLanguage
            }
            onClick={() => {
              setInputFields({
                nativeLanguage: nativeLanguage,
                targetLanguage: targetLanguage,
              } as InputFields);
            }}
          >
            Continue
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
