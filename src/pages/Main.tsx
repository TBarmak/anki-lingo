import { useState } from "react";
import Loading from "../components/Loading";
import { ScrapedResponse } from "../types/types";
import ResourceForm from "../components/forms/ResourceForm";
import CardFormatForm from "../components/forms/CardFormatForm";
import Download from "../components/Download";

export default function Main() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scrapedData, setScrapedData] = useState<ScrapedResponse[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [exportFields, setExportFields] = useState<string[]>([]);

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
        <Download downloadUrl={downloadUrl} />
      </div>
    );
  }

  if (scrapedData.length > 0) {
    return (
      <div className="w-full h-screen route-component">
        <CardFormatForm
          scrapedData={scrapedData}
          exportFields={exportFields}
          setDownloadUrl={setDownloadUrl}
          setIsLoading={setIsLoading}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-screen route-component">
      <ResourceForm
        setIsLoading={setIsLoading}
        setScrapedData={setScrapedData}
        setExportFields={setExportFields}
      />
    </div>
  );
}
