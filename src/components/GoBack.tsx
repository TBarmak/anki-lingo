import { IoChevronBackOutline } from "react-icons/io5";

type Props = {
  goToPreviousStep: () => void;
};

export default function GoBack({ goToPreviousStep }: Props) {
  return (
    <button
      onClick={() => goToPreviousStep()}
      className="text-lg flex items-center"
    >
      <div className="group hover:cursor-pointer flex items-center">
        <div className="flex flex-col justify-center items-start">
          <IoChevronBackOutline color="#162e50" />
          <div className="h-0.5" />
        </div>
        <div className="flex flex-col justify-center items-start">
          <p className="mx-1 secondary-text">Go back</p>
          <div
            className={
              "max-w-0 group-hover:max-w-full transition-all duration-300 rounded-full w-full h-0.5 bg-black"
            }
          />
        </div>
      </div>
    </button>
  );
}
