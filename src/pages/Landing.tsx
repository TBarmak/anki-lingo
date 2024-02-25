import { Link } from "react-router-dom";
import waves from "../assets/waves.svg";

export default function Landing() {
  return (
    <div className="route-component min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center flex-1">
        <p className="secondary-text text-6xl font-bold font-['Lora'] my-2">
          Anki Lingo
        </p>
        <p className="secondary-text text-lg text-center font-['Questrial'] my-2">
          Automate generating anki flashcards for learning foreign languages.
        </p>
        <Link className="button my-20" to="/main">
          <div className="text-center">Get Started</div>
        </Link>
      </div>
      <div className="w-full absolute bottom-0 -z-10">
        <img src={waves} className="w-full h-full object-bottom object-cover" />
      </div>
    </div>
  );
}
