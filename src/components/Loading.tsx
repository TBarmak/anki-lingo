import { Bars } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="my-4">
        <Bars height="60" width="60" color="#162e50" />
      </div>
      <p className="text-xl secondary-text">Creating your flashcards...</p>
    </div>
  );
}
