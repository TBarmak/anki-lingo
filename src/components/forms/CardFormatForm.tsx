import { useEffect, useState } from "react";
import { ExportField, ScrapedResponse } from "../../types/types";

type Props = {
  scrapedData: ScrapedResponse[];
  exportFields: ExportField[];
  setExportFields: React.Dispatch<React.SetStateAction<ExportField[]>>;
  setDownloadUrl: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CardFormatForm({
  scrapedData,
  exportFields,
  setExportFields,
  setDownloadUrl,
  setIsLoading,
}: Props) {
  const [fieldMapping, setFieldMapping] = useState<{ [key: string]: string }>();
  const [numSides, setNumSides] = useState<number>(2);
  const [lastHoveredSide, setLastHoveredSide] = useState<number>();

  useEffect(() => {
    fetch("/api/field-mapping")
      .then((res) => res.json())
      .then((data) => setFieldMapping(data));
  }, []);

  function handleOnDrag(e: React.DragEvent, field: string) {
    e.dataTransfer.setData("value", field);
  }

  function handleOnDrop(e: React.DragEvent) {
    const value = e.dataTransfer.getData("value") as string;
    setExportFields(
      exportFields.map((field) => {
        if (field.value === value) {
          field.side = lastHoveredSide;
        }
        return field;
      })
    );
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
        exportFields: exportFields,
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
    <div className="flex flex-col h-screen">
      <div className="flex flex-row justify-center items-center w-full flex-1">
        {Array.from({ length: numSides }, (_, index) => (
          <div
            key={index}
            onDrop={handleOnDrop}
            onDragOver={(e) => handleDragOver(e, index)}
            className="h-full bg-gray-200 flex-1 mx-4 rounded"
          >
            {exportFields
              .filter((field) => field.side === index)
              .map((field, index) => {
                return (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleOnDrag(e, field.value)}
                    className="bg-white rounded my-1 p-1 px-2 flex justify-between items-center"
                  >
                    <p>
                      {fieldMapping ? fieldMapping[field.value] : field.value}
                    </p>
                    <button
                      onClick={() => {
                        setExportFields(
                          exportFields.map((f) => {
                            if (f.value === field.value) {
                              f.side = -1;
                            }
                            return f;
                          })
                        );
                      }}
                      className="text-red-500"
                    >
                      x
                    </button>
                  </div>
                );
              })}
          </div>
        ))}
        <div className="flex-1 flex flex-col justify-center items-center">
          <button
            onClick={() => setNumSides(numSides + 1)}
            className="text-4x text-white font-bold bg-green-900 p-2 px-4 rounded-full w-min my-2"
          >
            +
          </button>
          {numSides > 2 && (
            <button
              onClick={() => setNumSides(numSides - 1)}
              className="text-4x text-white font-bold bg-red-600 p-2 px-4 rounded-full w-min my-2"
            >
              -
            </button>
          )}
        </div>
      </div>
      <div
        onDrop={handleOnDrop}
        onDragOver={(e) => handleDragOver(e, -1)}
        className="flex-1 flex flex-col bg-red-100 rounded m-2"
      >
        {exportFields
          .filter((field) => field.side === -1)
          .map((field) => (
            <div className="bg-white rounded my-1 p-1 px-2 flex flex-row justify-between items-center">
              <p>{fieldMapping ? fieldMapping[field.value] : field.value}</p>
              <button
                onClick={() => {
                  setExportFields(
                    exportFields.map((f) => {
                      if (f.value === field.value) {
                        f.side = 1;
                      }
                      return f;
                    })
                  );
                }}
                className="text-green-700"
              >
                +
              </button>
            </div>
          ))}
      </div>
      <button
        className="bg-black text-white px-6 py-2 rounded-full"
        onClick={formatCSV}
      >
        Create CSV
      </button>
    </div>
  );
}
