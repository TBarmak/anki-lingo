import moment from "moment";

interface Props {
  downloadUrl: string;
}

export default function Download({downloadUrl}: Props) {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-blue-200">
      <a
        className="bg-blue-800 text-white rounded-xl px-6 py-2 my-4"
        href={downloadUrl}
        download={`anki-lang-${moment().format("YYYYMMDHHmmss")}.zip`}
      >
        Download
      </a>
    </div>
  );
}
