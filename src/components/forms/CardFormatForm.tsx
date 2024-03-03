import { useEffect, useState } from "react";
import { CardFormat, CardSide, ScrapedResponse } from "../../types/types";
import {
  MdOutlineRemoveCircle,
  MdDragIndicator,
  MdLock,
  MdAddCircle,
  MdRemoveCircle,
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  scrapedData: ScrapedResponse[];
  exportFields: string[];
  setDownloadUrl: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CardFormatForm({
  scrapedData,
  exportFields,
  setDownloadUrl,
  setIsLoading,
}: Props) {
  const [fieldMapping, setFieldMapping] = useState<{ [key: string]: string }>();
  const [cardFormat, setCardFormat] = useState<CardFormat>({
    sides: [{ fields: ["inputWord"] }],
  });
  const [lastHoveredSide, setLastHoveredSide] = useState<number>();
  const [lastDraggedValue, setLastDraggedValue] = useState<string>("");
  const [lastDraggedSide, setLastDraggedSide] = useState<number>();
  const MIN_SIDES = 2;
  const MAX_SIDES = 5;

  useEffect(() => {
    fetch("/api/field-mapping")
      .then((res) => res.json())
      .then((data) => setFieldMapping(data));
  }, []);

  useEffect(() => {
    const defaultFormat: CardFormat = {
      sides: [{ fields: ["inputWord"] }, { fields: exportFields }],
    };
    setCardFormat(defaultFormat);
  }, [exportFields]);

  function handleOnDrag(field: string, side?: number) {
    setLastDraggedValue(field);
    setLastDraggedSide(side);
  }

  function handleOnDrop(e: React.DragEvent) {
    e.preventDefault();
    const sidesCopy: CardSide[] = JSON.parse(JSON.stringify(cardFormat.sides));
    if (lastHoveredSide && lastDraggedValue) {
      const side: CardSide = sidesCopy[lastHoveredSide];
      side.fields.push(lastDraggedValue);
      if (lastDraggedSide) {
        const draggedFromSide = sidesCopy[lastDraggedSide];
        draggedFromSide.fields = draggedFromSide.fields.filter(
          (field) => field != lastDraggedValue
        );
      }
      setCardFormat({ sides: sidesCopy });
    }
  }

  function handleDragOver(e: React.DragEvent, side: number) {
    setLastHoveredSide(side);
    e.preventDefault();
  }

  function formatCSV() {
    fetch("/api/format-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardFormat: cardFormat,
        scrapedData: scrapedData,
      }),
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        setDownloadUrl(url);
        setIsLoading(false);
      });
  }

  return (
    <motion.div
      className="flex flex-col w-full min-h-full"
      variants={{
        exit: {
          opacity: 0,
          transition: { ease: "easeInOut", duration: 0.75 },
        },
      }}
      exit="exit"
    >
      <div className="w-full flex-1 flex flex-row px-10">
        <div className="flex-[4] flex flex-row items-center">
          <motion.div
            className="flex flex-col items-center h-full flex-1 mx-2"
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.75, delay: 0.25 }}
          >
            <p className="text-2xl font-bold my-2 secondary-text">Side 1</p>
            <div className="h-full bg-white mx-4 rounded flex flex-col relative w-full">
              <div className="absolute w-full h-full flex flex-col justify-center items-center rounded">
                <MdLock size="48" color="#162e50" />
              </div>
              {cardFormat?.sides[0].fields.map((field, index) => (
                <div
                  key={index}
                  className="bg-white w-full text-lg p-1 px-2 rounded border-[1px] border-gray-200 flex flex-row justify-between items-center"
                >
                  {fieldMapping ? fieldMapping[field] : field}
                </div>
              ))}
            </div>
          </motion.div>
          {cardFormat?.sides.slice(1).map((side, sideIndex) => (
            <motion.div
              key={sideIndex}
              {...(!side.fields.includes(lastDraggedValue) && {
                onDrop: handleOnDrop,
                onDragOver: (e) => handleDragOver(e, sideIndex + 1),
              })}
              className="flex flex-col items-center h-full w-full flex-1 mx-2"
              variants={{
                hidden: { opacity: 0, x: sideIndex == 0 ? -100 : 0 },
                visible: { opacity: 1, x: 0 },
              }}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.75, delay: sideIndex == 0 ? 0.25 : 0 }}
            >
              <p className="text-2xl font-bold my-2 secondary-text">
                Side {sideIndex + 2}
              </p>
              <div className="h-full bg-white rounded flex flex-col relative w-full">
                <AnimatePresence>
                  {side.fields.map((field) => (
                    <motion.div
                      key={field}
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
                      transition={{ duration: 0.25 }}
                      {...(cardFormat.sides.length > 2
                        ? {
                            draggable: true,
                            onDragStart: (e) =>
                              handleOnDrag(field, sideIndex + 1),
                          }
                        : {})}
                      className={`bg-white w-full text-lg secondary-text p-1 px-2 rounded border-[1px] border-gray-200 flex flex-row justify-between items-center ${
                        cardFormat.sides.length > 2
                          ? "hover:cursor-pointer"
                          : ""
                      }`}
                    >
                      {fieldMapping ? fieldMapping[field] : field}
                      <button
                        onClick={() => {
                          const currSideIndex = sideIndex + 1;
                          const sidesCopy: CardSide[] = JSON.parse(
                            JSON.stringify(cardFormat.sides)
                          );
                          const side: CardSide = sidesCopy[currSideIndex];
                          side.fields.splice(side.fields.indexOf(field), 1);
                          setCardFormat({ sides: sidesCopy });
                        }}
                        className="mx-2"
                      >
                        <MdOutlineRemoveCircle color="#ad343e" size="20" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
          <div className="flex flex-col items-center justify-center mx-4">
            {cardFormat?.sides.length < MAX_SIDES && (
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.75,
                  delay: cardFormat.sides.length == 1 ? 0.75 : 0,
                }}
              >
                <motion.button
                  className="m-1"
                  onClick={() => {
                    const newSides = [...cardFormat?.sides, { fields: [] }];
                    setCardFormat({ sides: newSides });
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <MdAddCircle size="48" color="#162e50" />
                </motion.button>
              </motion.div>
            )}
            {cardFormat.sides.length > MIN_SIDES && (
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.75 }}
              >
                <motion.button
                  className="m-1"
                  onClick={() => {
                    const newSides = cardFormat?.sides.slice(
                      0,
                      cardFormat.sides.length - 1
                    );
                    setCardFormat({ sides: newSides });
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <MdRemoveCircle size="48" color="#ad343e" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
        <motion.div
          className="flex-1 mx-4 rounded flex flex-col justify-center items-center"
          variants={{
            hidden: { opacity: 0, x: 100 },
            visible: { opacity: 1, x: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.75, delay: 0.5 }}
        >
          <p className="font-bold text-2xl secondary-text my-2">Fields</p>
          {exportFields.map((field, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleOnDrag(field)}
              className="bg-white w-full secondary-text text-lg p-1 px-2 rounded border-[1px] flex flex-row justify-between items-center hover:cursor-pointer"
            >
              {fieldMapping ? fieldMapping[field] : field}
              <div className="mx-2">
                <MdDragIndicator />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <motion.div
        className="w-full flex flex-row justify-center items-center mb-8 mt-12"
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.75, delay: 1 }}
      >
        <motion.button
          className="button"
          onClick={formatCSV}
          whileHover={{ scale: 1.05 }}
        >
          Create CSV
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
