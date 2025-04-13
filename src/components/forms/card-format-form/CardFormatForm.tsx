import { useEffect, useState } from "react";
import type { CardFormat, CardSide } from "../../../types/types";
import {
  MdOutlineRemoveCircle,
  MdDragIndicator,
  MdLock,
  MdAddCircle,
  MdRemoveCircle,
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  setCardFormat,
  setDownloadUrl,
  setIsLoading,
  setScrapedData,
} from "../../../store/rootSlice";
import type { RootState } from "../../../store";
import GoBack from "../../GoBack";
import formStyles from "../shared.module.css";
import { DELAY, EXIT, FADE, FADE_DOWN, FADE_LEFT, FADE_RIGHT, FADE_UP, HOVER, TRANSITION } from "../../../constants/animations";

export default function CardFormatForm() {
  const [fieldMapping, setFieldMapping] = useState<{ [key: string]: string }>();
  const [lastHoveredSide, setLastHoveredSide] = useState<number>();
  const [lastDraggedValue, setLastDraggedValue] = useState<string>("");
  const [lastDraggedSide, setLastDraggedSide] = useState<number>();
  const MIN_SIDES = 2;
  const MAX_SIDES = 5;

  const { scrapedData, exportFields, cardFormat } = useSelector(
    (state: RootState) => state.root
  );

  const dispatch = useDispatch();

  useEffect(() => {
    fetch("api/field-mapping")
      .then((res) => res.json())
      .then((data) => setFieldMapping(data));
  }, []);

  useEffect(() => {
    if (cardFormat.sides.length < 2) {
      const defaultFormat: CardFormat = {
        sides: [{ fields: ["inputWord"] }, { fields: exportFields }],
      };
      dispatch(setCardFormat(defaultFormat));
    }
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
      dispatch(setCardFormat({ sides: sidesCopy }));
    }
  }

  function handleDragOver(e: React.DragEvent, side: number) {
    setLastHoveredSide(side);
    e.preventDefault();
  }

  function formatCSV() {
    fetch("api/format-csv", {
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
        dispatch(setDownloadUrl(url));
        dispatch(setIsLoading(false));
      });
  }

  return (
    <motion.div
      className={`${formStyles.formContainer} px-10`}
      variants={{
        exit: EXIT.DEFAULT,
      }}
      exit="exit"
    >
      <motion.div
        variants={FADE_DOWN}
        initial="hidden"
        animate="visible"
        transition={TRANSITION.WITH_DELAY(DELAY.EXTRA_LONG)}
      >
        <GoBack goToPreviousStep={() => dispatch(setScrapedData([]))} />
      </motion.div>
      <div className="w-full flex-1 flex flex-row">
        <div className="flex-[4] flex flex-row items-center">
          <motion.div
            className="flex flex-col items-center h-full flex-1 mx-2"
            variants={FADE_LEFT}
            initial="hidden"
            animate="visible"
            transition={TRANSITION.WITH_DELAY(DELAY.SHORT)}
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
              variants={FADE_LEFT}
              initial="hidden"
              animate="visible"
              transition={TRANSITION.WITH_DELAY(sideIndex === 0 ? DELAY.SHORT : DELAY.NONE)}
            >
              <p className="text-2xl font-bold my-2 secondary-text">
                Side {sideIndex + 2}
              </p>
              <div className="h-full bg-white rounded flex flex-col relative w-full">
                <AnimatePresence>
                  {side.fields.map((field) => (
                    <motion.div
                      key={field}
                      variants={FADE}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={TRANSITION.QUICK}
                      {...(cardFormat.sides.length > 2
                        ? {
                            draggable: true,
                            onDragStart: () =>
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
                          dispatch(setCardFormat({ sides: sidesCopy }));
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
                variants={FADE}
                initial="hidden"
                animate="visible"
                transition={TRANSITION.WITH_DELAY(cardFormat.sides.length === 1 ? DELAY.LONG : DELAY.NONE)}
              >
                <motion.button
                  className="m-1"
                  onClick={() => {
                    const newSides = [...cardFormat?.sides, { fields: [] }];
                    dispatch(setCardFormat({ sides: newSides }));
                  }}
                  whileHover={HOVER.SCALE}
                >
                  <MdAddCircle size="48" color="#162e50" />
                </motion.button>
              </motion.div>
            )}
            {cardFormat.sides.length > MIN_SIDES && (
              <motion.div
                variants={FADE}
                initial="hidden"
                animate="visible"
                transition={TRANSITION.DEFAULT}
              >
                <motion.button
                  className="m-1"
                  onClick={() => {
                    const newSides = cardFormat?.sides.slice(
                      0,
                      cardFormat.sides.length - 1
                    );
                    dispatch(setCardFormat({ sides: newSides }));
                  }}
                  whileHover={HOVER.SCALE}
                >
                  <MdRemoveCircle size="48" color="#ad343e" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
        <motion.div
          className="flex-1 mx-4 rounded flex flex-col justify-center items-center"
          variants={FADE_RIGHT}
          initial="hidden"
          animate="visible"
          transition={TRANSITION.WITH_DELAY(DELAY.MEDIUM)}
        >
          <p className="font-bold text-2xl secondary-text my-2">Fields</p>
          {exportFields.map((field, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleOnDrag(field)}
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
        variants={FADE_UP}
        initial="hidden"
        animate="visible"
        transition={TRANSITION.WITH_DELAY(DELAY.LONG)}
      >
        <motion.button
          className="button"
          onClick={formatCSV}
          whileHover={HOVER.SCALE}
        >
          Create CSV
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
