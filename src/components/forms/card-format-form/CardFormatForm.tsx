import { useEffect, useState } from "react";
import type { CardFormat, CardSide } from "../../../types/types";
import { MdLock, MdAddCircle, MdRemoveCircle } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  setCardFormat,
  setDownloadUrl,
  setIsLoading,
  setScrapedData,
} from "../../../store/rootSlice";
import type { RootState } from "../../../store";
import BackButton from "../../BackButton";
import formStyles from "../shared.module.css";
import {
  DELAY,
  EXIT,
  FADE,
  FADE_DOWN,
  FADE_LEFT,
  FADE_RIGHT,
  FADE_UP,
  HOVER,
  TAP,
  TRANSITION,
} from "../../../constants/animations";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  useDroppable,
} from "@dnd-kit/core";
import DraggableField from "./DraggableField";

function DroppableSide({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="h-full w-full">
      {children}
    </div>
  );
}

export default function CardFormatForm() {
  const [fieldMapping, setFieldMapping] = useState<{ [key: string]: string }>();
  const MIN_SIDES = 2;
  const MAX_SIDES = 5;

  const { scrapedData, exportFields, cardFormat } = useSelector(
    (state: RootState) => state.root
  );

  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const draggedItemId = active.id as string;
    const destinationSideId = over.id as string;

    let fieldName: string;
    if (draggedItemId.startsWith("field-")) {
      fieldName = draggedItemId.replace("field-", "");
    } else {
      fieldName = draggedItemId.split("-")[2];
    }

    const destinationSideIndex = parseInt(destinationSideId.split("-")[1]);

    const sidesCopy: CardSide[] = JSON.parse(JSON.stringify(cardFormat.sides));

    if (draggedItemId.startsWith("side-")) {
      const sourceSideIndex = parseInt(draggedItemId.split("-")[1]);
      sidesCopy[sourceSideIndex].fields = sidesCopy[
        sourceSideIndex
      ].fields.filter((field) => field !== fieldName);
    }

    if (!sidesCopy[destinationSideIndex].fields.includes(fieldName)) {
      sidesCopy[destinationSideIndex].fields.push(fieldName);
    }

    dispatch(setCardFormat({ sides: sidesCopy }));
  };

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
        <BackButton goToPreviousStep={() => dispatch(setScrapedData([]))} />
      </motion.div>
      <div>
        <p className={`${formStyles.formStepTitle} my-4`}>
          Design the flashcards by adding new sides and dragging and dropping
          fields
        </p>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="md:flex-1 flex flex-row h-max justify-center">
          <div className="flex md:flex-[4] flex-col md:flex-row items-center">
            <motion.div
              className="flex flex-col items-center md:h-full md:flex-1 mx-2 w-full"
              variants={FADE_LEFT}
              initial="hidden"
              animate="visible"
              transition={TRANSITION.WITH_DELAY(DELAY.SHORT)}
            >
              <p className="text-2xl font-bold my-2 secondary-text">Side 1</p>
              <div className="md:h-full bg-white mx-4 rounded flex flex-col relative w-full">
                <div className="md:h-full absolute w-full flex flex-col justify-center items-center rounded">
                  <MdLock size="48" color="#162e50" />
                </div>
                {cardFormat?.sides[0].fields.map((field) => (
                  <DraggableField
                    key={field}
                    id={field}
                    field={field}
                    fieldMapping={fieldMapping}
                    isDraggable={false}
                    sideIndex={0}
                  />
                ))}
              </div>
            </motion.div>
            {cardFormat?.sides.slice(1).map((side, sideIndex) => (
              <motion.div
                key={`side-${sideIndex + 1}`}
                className="flex flex-col items-center md:h-full w-full flex-1 mx-2"
                variants={FADE_LEFT}
                initial="hidden"
                animate="visible"
                transition={TRANSITION.WITH_DELAY(
                  sideIndex === 0 ? DELAY.SHORT : DELAY.NONE
                )}
              >
                <p className="text-2xl font-bold my-2 secondary-text">
                  Side {sideIndex + 2}
                </p>
                <div className="bg-white rounded flex flex-col relative w-full md:h-full min-h-32 pb-8">
                  <DroppableSide id={`side-${sideIndex + 1}`}>
                    <AnimatePresence>
                      {side.fields.map((field) => (
                        <DraggableField
                          key={field}
                          id={field}
                          field={field}
                          fieldMapping={fieldMapping}
                          onRemove={() => {
                            const sidesCopy = JSON.parse(
                              JSON.stringify(cardFormat.sides)
                            );
                            sidesCopy[sideIndex + 1].fields = sidesCopy[
                              sideIndex + 1
                            ].fields.filter((f: string) => f !== field);
                            dispatch(setCardFormat({ sides: sidesCopy }));
                          }}
                          isDraggable={cardFormat.sides.length > 2}
                          sideIndex={sideIndex + 1}
                        />
                      ))}
                    </AnimatePresence>
                  </DroppableSide>
                </div>
              </motion.div>
            ))}
            <div className="flex flex-col items-center justify-center mx-4">
              {cardFormat?.sides.length < MAX_SIDES && (
                <motion.div
                  variants={FADE}
                  initial="hidden"
                  animate="visible"
                  transition={TRANSITION.WITH_DELAY(
                    cardFormat.sides.length === 1 ? DELAY.LONG : DELAY.NONE
                  )}
                >
                  <motion.button
                    className="m-1"
                    onClick={() => {
                      const newSides = [...cardFormat?.sides, { fields: [] }];
                      dispatch(setCardFormat({ sides: newSides }));
                    }}
                    whileHover={HOVER.SCALE}
                    whileTap={TAP.SCALE}
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
                    whileTap={TAP.SCALE}
                  >
                    <MdRemoveCircle size="48" color="#ad343e" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
          <motion.div
            className="mx-4 rounded flex flex-col justify-center items-center sticky top-4 h-fit"
            variants={FADE_RIGHT}
            initial="hidden"
            animate="visible"
            transition={TRANSITION.WITH_DELAY(DELAY.MEDIUM)}
          >
            <p className="font-bold text-2xl secondary-text my-2">Fields</p>
            {exportFields.map((field) => (
              <DraggableField
                key={field}
                id={field}
                field={field}
                fieldMapping={fieldMapping}
                isFieldList={true}
              />
            ))}
          </motion.div>
        </div>
      </DndContext>
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
          whileTap={TAP.SCALE}
        >
          Create CSV
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
