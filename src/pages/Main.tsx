import { useState } from "react";
import Loading from "../components/Loading";
import { ExportField, ScrapedResponse } from "../types/types";
import ResourceForm from "../components/forms/ResourceForm";
import CardFormatForm from "../components/forms/CardFormatForm";
import Download from "../components/Download";

export default function Main() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scrapedData, setScrapedData] = useState<ScrapedResponse[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [exportFields, setExportFields] = useState<ExportField[]>([
    {
      value: "word",
      side: 1,
    },
    {
      value: "pos",
      side: 1,
    },
    {
      value: "definition",
      side: 1,
    },
    {
      value: "translations",
      side: 1,
    },
    {
      value: "targetExampleSentences",
      side: 1,
    },
    {
      value: "nativeExampleSentences",
      side: 1,
    },
    {
      value: "audio",
      side: 1,
    },
  ]);

  // if (isLoading) {
  //   return <Loading />;
  // }

  // if (downloadUrl) {
  //   return <Download downloadUrl={downloadUrl} />;
  // }

  // if (scrapedData.length > 0) {
  return (
    <CardFormatForm
      scrapedData={scrapedData}
      exportFields={exportFields}
      setExportFields={setExportFields}
      setDownloadUrl={setDownloadUrl}
      setIsLoading={setIsLoading}
    />
  );
  // }

  return (
    <div className="w-full h-screen flex flex-row items-center justify-center bg-blue-200">
      <ResourceForm
        setIsLoading={setIsLoading}
        setScrapedData={setScrapedData}
        setExportFields={setExportFields}
      />
    </div>
  );
}
