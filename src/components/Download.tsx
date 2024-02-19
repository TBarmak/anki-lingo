import moment from "moment";

interface Props {
  downloadUrl: string;
}

export default function Download({ downloadUrl }: Props) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-[20%]">
      <p className="text-xl secondary-text">
        Your csv is ready to be downloaded. For instructions on how to import
        the files into anki, please see this{" "}
        <span className="italic">article</span>.
      </p>
      <a
        className="button"
        href={downloadUrl}
        download={`anki-lang-${moment().format("YYYYMMDHHmmss")}.zip`}
      >
        Download
      </a>
    </div>
  );
}
