import { useState } from "react";
import Loading from "../components/Loading";
import type { WordScrapeError } from "../types/types";
import ResourceForm from "../components/forms/ResourceForm";
import CardFormatForm from "../components/forms/CardFormatForm";
import Download from "../components/Download";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function Main() {
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [exportFields, setExportFields] = useState<string[]>([]);
  const isLoading = useSelector((state: RootState) => state.root.isLoading);
  const scrapedData = useSelector((state: RootState) => state.root.scrapedData);

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

  if (isLoading) {
    return (
      <div className="w-full h-screen route-component">
        <Loading />
      </div>
    );
  }

  if (downloadUrl) {
    return (
      <div className="w-full h-screen route-component">
        <Download downloadUrl={downloadUrl} errors={getErrors()} />
      </div>
    );
  }

  if (scrapedData.length > 0) {
    return (
      <div className="w-full h-screen route-component">
        <CardFormatForm
          exportFields={exportFields}
          setDownloadUrl={setDownloadUrl}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-screen route-component">
      <ResourceForm setExportFields={setExportFields} />
    </div>
  );
}
