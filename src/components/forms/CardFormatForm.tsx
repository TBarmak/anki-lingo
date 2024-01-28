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
  function handleFieldCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newCheckboxField = exportFields.map((field) => {
      if (field.name === e.target.name) {
        field.isSelected = !field.isSelected;
      }
      return field;
    });
    setExportFields(newCheckboxField);
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
    <div className="flex-[3] flex flex-col w-full">
      {exportFields.length > 0 && (
        <p>Select the fields you would like to include in the flashcards:</p>
      )}
      {exportFields.map((field, index) => {
        return (
          <label key={index}>
            <input
              name={field.name}
              type="checkbox"
              className="mx-2"
              checked={field.isSelected ?? false}
              onChange={(e) => handleFieldCheckboxChange(e)}
            />
            {field.name}
          </label>
        );
      })}
      <button className="bg-black text-white p-4 rounded-full" onClick={formatCSV}>Create CSV</button>
    </div>
  );
}
