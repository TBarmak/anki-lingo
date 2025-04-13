import Loading from "../components/Loading";
import ResourceForm from "../components/forms/resource-form/ResourceForm";
import Download from "../components/Download";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { ReactNode } from "react";
import CardFormatForm from "../components/forms/card-format-form/CardFormatForm";

export default function Main() {
  const { isLoading, scrapedData, downloadUrl } = useSelector(
    (state: RootState) => state.root
  );

  return (
    <div className="w-full h-screen route-component">
      {((): ReactNode => {
        if (isLoading) return <Loading />;
        if (downloadUrl) return <Download />;
        if (scrapedData.length > 0) return <CardFormatForm />;
        return <ResourceForm />;
      })()}
    </div>
  );
}
