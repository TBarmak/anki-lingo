import { useEffect, useState } from "react";
import type { CardFormat, CardSide } from "../../../types/types";
import {
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
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, TouchSensor, useDroppable } from '@dnd-kit/core';
import DraggableField from './DraggableField';

function DroppableSide({ id, children }: { id: string; children: React.ReactNode }) {
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

    const activeId = active.id as string;
    const targetSideId = over.id as string;
    
    let fieldName: string;
    if (activeId.startsWith('field-')) {
      fieldName = activeId.replace('field-', '');
    } else {
      fieldName = activeId.split('-').slice(2).join('-');
    }
    
    const targetSideIndex = parseInt(targetSideId.replace('side-', ''));

    const sidesCopy: CardSide[] = JSON.parse(JSON.stringify(cardFormat.sides));
    
    if (activeId.startsWith('side-')) {
      const sourceSideIndex = parseInt(activeId.split('-')[1]);
      sidesCopy[sourceSideIndex].fields = sidesCopy[sourceSideIndex].fields.filter(field => field !== fieldName);
    }

    if (!sidesCopy[targetSideIndex].fields.includes(fieldName)) {
      sidesCopy[targetSideIndex].fields.push(fieldName);
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
        <GoBack goToPreviousStep={() => dispatch(setScrapedData([]))} />
      </motion.div>
      <div>
        <p className={`${formStyles.formStepTitle} my-4`}>Design the flashcards by adding new sides and dragging and dropping fields</p>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
                  <DroppableSide id={`side-${sideIndex + 1}`}>
                    <AnimatePresence>
                      {side.fields.map((field) => (
                        <DraggableField
                          key={field}
                          id={field}
                          field={field}
                          fieldMapping={fieldMapping}
                          onRemove={() => {
                            const sidesCopy = JSON.parse(JSON.stringify(cardFormat.sides));
                            sidesCopy[sideIndex + 1].fields = sidesCopy[sideIndex + 1].fields.filter((f: string) => f !== field);
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
            <DroppableSide id="fields">
              {exportFields.map((field) => (
                <DraggableField
                  key={field}
                  id={field}
                  field={field}
                  fieldMapping={fieldMapping}
                  isFieldList={true}
                />
              ))}
            </DroppableSide>
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
        >
          Create CSV
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
