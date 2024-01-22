import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-blue-200">
      <div className="bg-blue-700 rounded-full w-16 h-16 m-8"></div>
      <p className="text-4xl font-bold m-4">Anki Lingo</p>
      <p className="italic m-4">
        Automate generating anki flashcards for learning foreign languages
      </p>
      <Link
        className="bg-blue-700 text-2xl mx-8 rounded-2xl px-12 py-2 my-8 hover:bg-blue-800 transition-all duration-500"
        to="/main"
      >
        <div className="w-36 text-center text-white">Get Started</div>
      </Link>
    </div>
  );
}
