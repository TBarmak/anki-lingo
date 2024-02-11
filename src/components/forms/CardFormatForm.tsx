import { useEffect, useState } from "react";
import { CardFormat, CardSide, ScrapedResponse } from "../../types/types";
import {
  MdOutlineRemoveCircle,
  MdDragIndicator,
  MdLock,
  MdAddCircle,
  MdRemoveCircle,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
} from "react-icons/md";

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
    sides: [{ fields: ["word"], useWhitespace: false }],
  });
  const [lastHoveredSide, setLastHoveredSide] = useState<number>();
  const [lastDraggedValue, setLastDraggedValue] = useState<string>("");

  useEffect(() => {
    fetch("/api/field-mapping")
      .then((res) => res.json())
      .then((data) => setFieldMapping(data));
  }, []);

  useEffect(() => {
    const defaultFormat: CardFormat = {
      sides: [
        { fields: ["word"], useWhitespace: false },
        { fields: exportFields, useWhitespace: true },
      ],
    };
    setCardFormat(defaultFormat);
  }, [exportFields]);

  function handleOnDrag(e: React.DragEvent, field: string) {
    setLastDraggedValue(field);
  }

  function handleOnDrop(e: React.DragEvent) {
    e.preventDefault();
    const sidesCopy: CardSide[] = JSON.parse(JSON.stringify(cardFormat.sides));
    if (lastHoveredSide) {
      const side: CardSide = sidesCopy[lastHoveredSide];
      side.fields.push(lastDraggedValue);
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
    <div className="flex flex-col w-full h-screen bg-blue-200">
      <div className="w-full h-16 bg-blue-800" />
      <div className="w-full flex-1 flex flex-row px-10">
        <div className="flex-[4] flex flex-row items-center">
          <div className="flex flex-col items-center h-full flex-1 mx-2">
            <p className="font-bold my-2">Side 1</p>
            <div className="h-full bg-white mx-4 rounded flex flex-col relative w-full">
              <div className="absolute w-full h-full bg-[#00000020] flex flex-col justify-center items-center rounded">
                <MdLock size={48} color="#777" />
              </div>
              {cardFormat?.sides[0].fields.map((field, index) => (
                <div
                  key={index}
                  className="bg-white w-full p-1 px-2 rounded border-[1px] border-gray-200 flex flex-row justify-between items-center"
                >
                  {fieldMapping ? fieldMapping[field] : field}
                </div>
              ))}
            </div>
            <div className="h-10"/>
          </div>
          {cardFormat?.sides.slice(1).map((side, sideIndex) => (
            <div
              key={sideIndex}
              {...(!side.fields.includes(lastDraggedValue) && {
                onDrop: handleOnDrop,
                onDragOver: (e) => handleDragOver(e, sideIndex + 1),
              })}
              className="flex flex-col items-center h-full w-full flex-1 mx-2"
            >
              <p className="font-bold my-2">Side {sideIndex + 2}</p>
              <div className="h-full bg-white rounded flex flex-col relative w-full">
                {side.fields.map((field, index) => (
                  <div
                    key={index}
                    className="bg-white w-full p-1 px-2 rounded border-[1px] border-gray-200 flex flex-row justify-between items-center"
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
                    >
                      <MdOutlineRemoveCircle color="red" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="h-10 flex flex-row justify-center items-center w-full">
                <button
                  className="mx-2"
                  onClick={() => {
                    const currSideIndex = sideIndex + 1;
                    const sidesCopy: CardSide[] = JSON.parse(
                      JSON.stringify(cardFormat.sides)
                    );
                    sidesCopy[currSideIndex].useWhitespace =
                      !sidesCopy[currSideIndex].useWhitespace;
                    setCardFormat({ sides: sidesCopy });
                  }}
                >
                  {side.useWhitespace ? (
                    <MdCheckBox size={22} />
                  ) : (
                    <MdCheckBoxOutlineBlank size={22} />
                  )}
                </button>
                <p>Include whitespace?</p>
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center mx-4">
            {cardFormat?.sides.length < 5 && (
              <button
                className="m-1"
                onClick={() => {
                  const newSides = [
                    ...cardFormat?.sides,
                    { fields: [], useWhitespace: true },
                  ];
                  setCardFormat({ sides: newSides });
                }}
              >
                <MdAddCircle size={32} color={"green"} />
              </button>
            )}
            {cardFormat.sides.length > 2 && (
              <button
                className="m-1"
                onClick={() => {
                  const newSides = cardFormat?.sides.slice(
                    0,
                    cardFormat.sides.length - 1
                  );
                  setCardFormat({ sides: newSides });
                }}
              >
                <MdRemoveCircle size={32} color={"red"} />
              </button>
            )}
          </div>
        </div>
        <div className="h-full flex-1 mx-4 rounded flex flex-col justify-center">
          <p className="font-bold text-2xl">Fields</p>
          {exportFields.map((field, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleOnDrag(e, field)}
              className="bg-white w-full p-1 px-2 rounded border-[1px] border-gray-200 flex flex-row justify-between items-center hover:cursor-pointer"
            >
              {fieldMapping ? fieldMapping[field] : field}
              <MdDragIndicator />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-center items-center mb-8 mt-4">
        <button
          className="bg-black text-white px-6 py-2 rounded"
          onClick={formatCSV}
        >
          Create CSV
        </button>
      </div>
    </div>
  );
}
