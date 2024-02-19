import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="route-component h-screen">
      <div className="flex flex-col justify-center items-center w-full primary-background h-full">
        <div className="accent-background rounded-full w-16 h-16 m-8"></div>
        <p className="secondary-text text-4xl font-bold m-4">Anki Lingo</p>
        <p className="secondary-text italic m-4">
          Automate generating anki flashcards for learning foreign languages
        </p>
        <Link
          className="button"
          to="/main"
        >
          <div className="text-center">Get Started</div>
        </Link>
      </div>
    </div>
  );
}
