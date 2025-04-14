import Loading from "../components/Loading";
import ResourceForm from "../components/forms/resource-form/ResourceForm";
import Download from "../components/Download";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { ReactNode } from "react";
import CardFormatForm from "../components/forms/card-format-form/CardFormatForm";
import { AnimatePresence } from "framer-motion";

export default function Main() {
  const { isLoading, scrapedData, downloadUrl } = useSelector(
    (state: RootState) => state.root
  );

  return (
    <div className="w-full h-screen route-component">
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          window.scrollTo(0, 0);
        }}
      >
        {((): ReactNode => {
          if (isLoading) return <Loading key="loading" />;
          if (downloadUrl) return <Download key="download" />;
          if (scrapedData.length > 0) return <CardFormatForm key="card-format" />;
          return <ResourceForm key="resource-form" />;
        })()}
      </AnimatePresence>
    </div>
  );
}
