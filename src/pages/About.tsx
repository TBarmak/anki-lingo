import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function About() {
  return (
    <div className="route-component flex flex-col justify-center items-center min-h-screen">
      <p className="secondary-text px-[20%] text-lg">
        <span className="font-bold text-xl italic">Anki Lingo</span> is a tool
        for automating the creation of Anki flashcards for language learning.
        Simply enter vocab words, select the target and native language, and
        select the resources that you'd like to use to create the flashcards.
        After scraping the data, you can design your flashcards by selecting
        which fields you'd like to include on each side. Finally, Anki Lingo will
        produce a zip file that contains a csv and any audio files for the words.
      </p>
      <div className="flex flex-row justify-center w-full my-16">
        <div className="mx-4 hover:cursor-pointer">
          <FaYoutube color="#162e50" size={64} />
        </div>
        <div className="mx-4 hover:cursor-pointer">
          <FaGithub color="#162e50" size={64} />
        </div>
        <div className="mx-4 hover:cursor-pointer">
          <FaLinkedin color="#162e50" size={64} />
        </div>
      </div>
    </div>
  );
}
